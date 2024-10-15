import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { ProductEntity, ProductFirebase } from "entitis/entitis";
import {
  useCollection,
  useDocument,
  useFirestore,
  useFirebaseStorage,
} from "vuefire";
import {
  collection,
  addDoc,
  query,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { watch } from "vue";
import showToastNotification from "@/services/notifications";

const useProductsStore = defineStore("products", () => {
  const products = ref<string[]>([]);
  const db = useFirestore();
  const storage = useFirebaseStorage();

  const selectCategory = ref(1);
  const isDataAvailable = ref(true);
  const categories = [
    { id: 1, name: "Sudaderas" },
    { id: 2, name: "Tenis" },
    { id: 3, name: "Lentes" },
  ];

  const q = query(collection(db, "products"));
  const productsCollection = useCollection(q);

  const selectProduct = ref<ProductFirebase>({
    id: "",
    name: "",
    image: "",
    price: 0,
    category: 1,
    stock: 0,
  });

  const computedProducts = computed<ProductFirebase[]>(() => {
    const productArray = productsCollection.value || [];
    return productArray.map((product) => ({
      id: product.id,
      ...product,
    })) as ProductFirebase[];
  });

  const filterProducts = computed(() => {
    return computedProducts.value
      .filter((item) => item.category === selectCategory.value)
      .filter((item) => item.stock > 0);
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const loadData = async () => {
    await delay(1000);
    isDataAvailable.value = false;
  };

  const noResults = computed(() => productsCollection.value?.length === 0);

  const queryProductById = (id: string) => {
    const docRef = doc(db, "products", id);
    const product = useDocument(docRef);
    watch(product, () => {
      if (product.value) {
        selectProduct.value = {
          id: product.value.id,
          image: product.value.image,
          name: product.value.name,
          price: product.value.price,
          category: product.value.category,
          stock: product.value.stock,
        };
      }
    });
  };

  const addProduct = async (product: ProductEntity) => {
    try {
      await addDoc(collection(db, "products"), product);
      showToastNotification("Producto agregado", true);
    } catch (error) {
      showToastNotification("Error al agregar el producto", false);
    }
  };

  const changeProduct = async (product: ProductFirebase) => {
    selectProduct.value = product;
  };

  const updateProduct = async (id: string, product: ProductEntity) => {
    try {
      const newProduct = {
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
        stock: product.stock,
      };

      await updateDoc(doc(db, "products", id), newProduct);
      showToastNotification("Producto actualizado", true);
    } catch (error) {
      showToastNotification("Error al actualizar el producto", false);
    }
  };

  const removeProduct = async (id: string) => {
    try {
      const docDb = doc(db, "products", id);
      const snapshot = await getDoc(docDb);
      const data = snapshot.data();
      const imageRef = storageRef(storage, data?.image);
      await Promise.all([deleteDoc(docDb), deleteObject(imageRef)]);
      showToastNotification("Producto eliminado", true);
    } catch (error) {
      showToastNotification("Error al eliminar el producto", false);
    }
  };

  const categoriesOptions = computed(() => {
    const options = [
      {
        value: "",
        label: "Selecciona una categoría",
        attrs: { disabled: true },
      },
      ...categories.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ];
    return options;
  });

  const validateIsNumber = (value: string) => {
    return Number.isNaN(Number(value));
  };

  return {
    products,
    computedProducts,
    filterProducts,
    selectProduct,
    selectCategory,
    isDataAvailable,
    noResults,
    categories,
    loadData,
    queryProductById,
    addProduct,
    updateProduct,
    removeProduct,
    categoriesOptions,
    validateIsNumber,
    productsCollection,
    changeProduct,
  };
});

export default useProductsStore;
