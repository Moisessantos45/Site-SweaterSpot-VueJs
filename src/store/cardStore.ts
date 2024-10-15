import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import {
  addDoc,
  query,
  collection,
  doc,
  getDoc,
  runTransaction,
  where,
  writeBatch,
  getDocs,
  DocumentReference,
} from "firebase/firestore";
import { useFirestore } from "vuefire";
import { ProductFirebase, ProductCardStores } from "@/entitis/entitis";
import showToastNotification from "@/services/notifications";
import useCouponStore from "./couponStore";
import { createFormattedDate } from "@/helpers/index";

interface ProductData {
  ref: DocumentReference;
  stock: number;
  quantity: number;
}

const useCardStore = defineStore("card", () => {
  const couponStore = useCouponStore();
  const db = useFirestore();
  const productsCards = ref<ProductCardStores[]>([]);
  const isEmpty = computed(() => productsCards.value.length === 0);
  const subTotal = ref(0);
  const taxes = ref(0);
  const total = ref(0);

  watchEffect(() => {
    subTotal.value = productsCards.value.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    taxes.value = Number((subTotal.value * 0.16).toFixed(2));
    total.value = Number((subTotal.value + taxes.value).toFixed(2));
  });

  const checkQuantity = computed(() => {
    return (product: ProductCardStores) =>
      product.stock < 5 ? product.stock : 5;
  });

  const updateQuantity = (id: string, quantity: number) => {
    const newProduct = productsCards.value.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    productsCards.value = newProduct;
  };

  const addProduct = (item: ProductFirebase) => {
    const productExist = productsCards.value.find(
      (product) => product.id === item.id
    );
    if (productExist) {
      if (
        productExist.quantity === productExist.stock ||
        productExist.quantity === 5
      ) {
        showToastNotification("Producto sin stock", false);
        return;
      }
      updateQuantity(item.id, productExist.quantity + 1);
    } else {
      productsCards.value.push({ ...item, quantity: 1 });
    }
    showToastNotification("Producto agregado al carrito", true);
  };

  const removeProduct = (id: string) => {
    const newProduct = productsCards.value.filter((item) => item.id !== id);
    productsCards.value = newProduct;
  };

  const emptyCard = () => {
    productsCards.value = [];
    subTotal.value = 0;
    taxes.value = 0;
    total.value = 0;
    couponStore.discountTotal = 0;
    couponStore.couponInput = "";
    couponStore.discount = 0;
  };

  const checkout = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        products: productsCards.value.map(({ stock, ...data }) => data),
        total: Number(total.value.toFixed(2)),
        subTotal: subTotal.value,
        taxes: taxes.value,
        discount: couponStore.discountTotal,
        id_coupon: couponStore.couponSelect?.id || "",
        createdAt: createFormattedDate(),
      });

      if (couponStore.couponSelect?.id) {
        const couponUsageRef = collection(db, "CouponUsage");
        const today = createFormattedDate();
        const couponUsageQuery = query(
          couponUsageRef,
          where("couponId", "==", couponStore.couponSelect.id),
          where("createdAt", "==", today)
        );

        const couponUsageQuerySnapshot = await getDocs(couponUsageQuery);

        const couponRef = doc(db, "coupons", couponStore.couponSelect.id);
        const couponSnap = await getDoc(couponRef);

        if (!couponSnap.exists()) {
          throw "El documento del cupón no existe";
        }

        const couponData = couponSnap.data();

        const productDataList: ProductData[] = [];
        for (const item of productsCards.value) {
          const productRef = doc(db, "products", item.id);
          const productSnap = await getDoc(productRef);

          if (!productSnap.exists()) {
            throw new Error(`El producto ${item.id} no existe`);
          }

          productDataList.push({
            ref: productRef,
            stock: productSnap.data().stock,
            quantity: item.quantity,
          });
        }

        await runTransaction(db, async (firtsTransaction) => {
          if (!couponStore.couponSelect?.id) {
            throw new Error("No hay cupón seleccionado");
          }

          if (couponUsageQuerySnapshot.empty) {
            // Si no existe el uso del cupón, crearlo
            const newCouponUsageRef = doc(couponUsageRef);
            firtsTransaction.set(newCouponUsageRef, {
              couponId: couponStore.couponSelect.id,
              quantity: 1,
              createdAt: today,
            });
          } else {
            // Si ya existe, actualizar la cantidad de uso
            const couponUsageDoc = couponUsageQuerySnapshot.docs[0];
            firtsTransaction.update(couponUsageDoc.ref, {
              quantity: couponUsageDoc.data().quantity + 1,
            });
          }

          // Actualizar la cantidad del cupón
          firtsTransaction.update(couponRef, {
            quantity: couponData.quantity - 1,
          });

          // Actualizar el stock de los productos
          for (const product of productDataList) {
            firtsTransaction.update(product.ref, {
              stock: product.stock - product.quantity,
            });
          }
        });
      } else {
        // Si no hay cupón, solo actualizar el stock de los productos
        const batch = writeBatch(db);
        for (const item of productsCards.value) {
          const productRef = doc(db, "products", item.id);
          const productSnap = await getDoc(productRef);

          if (!productSnap.exists()) {
            throw new Error(`El producto ${item.id} no existe`);
          }

          const productData = productSnap.data();
          batch.update(productRef, {
            stock: productData.stock - item.quantity,
          });
        }
        await batch.commit();
      }

      emptyCard();
      showToastNotification("Compra realizada con éxito", true);
    } catch (error) {
      showToastNotification("Error al realizar la compra", false);
    }
  };

  return {
    productsCards,
    isEmpty,
    subTotal,
    total,
    taxes,
    checkQuantity,
    updateQuantity,
    addProduct,
    removeProduct,
    checkout,
  };
});

export default useCardStore;
