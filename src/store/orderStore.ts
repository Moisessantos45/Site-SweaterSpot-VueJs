import { Orders } from "@/entitis/entitis";
import { query, collection, where } from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useFirestore, useCollection } from "vuefire";

const useOrderStore = defineStore("order", () => {
  const date = ref("");
  const db = useFirestore();

  const isDateSelect = computed(() => date.value);

  const orderSource = computed(() => {
    if (date.value) {
      const q = query(
        collection(db, "orders"),
        where("createdAt", "==", date.value)
      );
      return q;
    }
  });

  const ordersCollection = useCollection<Orders>(orderSource);

  const totalOrdersOfDate = computed(() => {
    return ordersCollection.value
      ? ordersCollection.value.reduce((acc, cur) => acc + cur.total, 0)
      : 0;
  });

  return {
    date,
    isDateSelect,
    orderSource,
    ordersCollection,
    totalOrdersOfDate,
  };
});

export default useOrderStore;
