import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  query,
  collection,
  where,
  addDoc,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useFirestore, useCollection } from "vuefire";
import useCardStore from "./cardStore";
import { watch } from "vue";
import {
  Coupon,
  CouponFirebase,
  UsageCouponFirebaseWithCoupon,
} from "@/entitis/entitis";
import { createFormattedDate } from "../helpers";
import showToastNotification from "@/services/notifications";

const useCouponStore = defineStore("coupon", () => {
  const couponInput = ref<string>("");
  const couponSelect = ref<CouponFirebase | null>(null);
  const isValid = ref<string>("");
  const discount = ref<number>(0);
  const discountTotal = ref<number>(0);

  const isVisibleModal = ref<boolean>(false);
  const date = ref<string>("");
  const totalDiscounts = ref<number>(0);
  const selectTypeView = ref<number>(1);
  const couponCollectionUsedWithCoupon = ref<UsageCouponFirebaseWithCoupon[]>(
    []
  );

  const cardStore = useCardStore();

  const db = useFirestore();

  const getCuponUsed = async (id: string) => {
    const q = doc(db, "coupons", id);
    const querySnapshot = await getDoc(q);
    if (querySnapshot.exists()) {
      return querySnapshot.data();
    }
    return null;
  };

  const couponSourceUsed = async () => {
    if (!date.value) {
      return;
    }

    const q = query(
      collection(db, "CouponUsage"),
      where("createdAt", "==", date.value)
    );
    try {
      const querySnapshot = await getDocs(q);

      const couponsWithDetails = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const couponUsed = await getCuponUsed(data.couponId);
          return {
            ...data,
            ...couponUsed,
            id: doc.id,
          };
        })
      );

      couponCollectionUsedWithCoupon.value =
        couponsWithDetails as UsageCouponFirebaseWithCoupon[];
    } catch (error) {
      return;
    }
  };

  watch([date, selectTypeView], async () => {
    if (selectTypeView.value === 2) {
      await couponSourceUsed();
    }
  });

  watch(discount, () => {
    const filterCategory = cardStore.productsCards.filter(
      (item) => item.category === couponSelect.value?.category
    );
    const totalDiscount = filterCategory.reduce(
      (acc, cur) => acc + cur.price * cur.quantity,
      0
    );
    discountTotal.value = Number((totalDiscount * discount.value).toFixed(2));
    cardStore.total -= discountTotal.value;
  });

  const isValidCoupon = computed(() => discountTotal.value > 0);
  const isDateSelect = computed(() => date.value === "");
  const isSelectTypeView = computed(() => selectTypeView.value);

  const couponSource = computed(() => {
    if (date.value) {
      const q = query(
        collection(db, "coupons"),
        where("createdAt", "==", date.value)
      );
      return q;
    }
  });
  const couponCollection = useCollection<CouponFirebase>(couponSource);

  const couponCollectionLength = computed(() => {
    return selectTypeView.value === 1
      ? couponCollection.value.length
      : couponCollectionUsedWithCoupon.value.length;
  });

  const couponsToDisplay = computed(() => {
    return selectTypeView.value === 1
      ? couponCollection.value
      : couponCollectionUsedWithCoupon.value;
  });

  const findCoupon = async (coupon: string): Promise<CouponFirebase | null> => {
    try {
      const q = query(
        collection(db, "coupons"),
        where("nameCoupon", "==", coupon)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      if (querySnapshot.docs.length === 0) return null;
      const couponData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return couponData[0] as CouponFirebase;
    } catch (error) {
      return null;
    }
  };

  const verifyCoupon = async () => {
    const foundCoupon = await findCoupon(couponInput.value);

    if (foundCoupon?.id && foundCoupon.quantity > 0) {
      couponSelect.value = foundCoupon;
      setTimeout(() => {
        discount.value = foundCoupon.discount;
        isValid.value = `Applying a discount of: ${foundCoupon.discount}...`;
      }, 3000);
    } else {
      isValid.value = "Invalid coupon";
    }

    setTimeout(() => {
      isValid.value = "";
    }, 6000);
  };

  const toggleModal = () => {
    isVisibleModal.value = !isVisibleModal.value;
  };

  const createCoupon = async (coupon: Coupon) => {
    try {
      await addDoc(collection(db, "coupons"), {
        ...coupon,
        createdAt: createFormattedDate(),
      });
      showToastNotification("Coupon added", true);
    } catch (error) {
      showToastNotification("Error adding coupon", false);
    }
  };

  return {
    couponInput,
    couponSelect,
    isValid,
    discount,
    discountTotal,
    isValidCoupon,
    isVisibleModal,
    date,
    verifyCoupon,
    isDateSelect,
    totalDiscounts,
    selectTypeView,
    isSelectTypeView,
    couponSource,
    couponsToDisplay,
    couponCollectionLength,
    toggleModal,
    findCoupon,
    createCoupon,
  };
});

export default useCouponStore;
