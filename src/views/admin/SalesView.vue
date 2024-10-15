<template>
  <p class="text-3xl font-black my-5">View sales data here</p>
  <div class="md:flex md:items-start gap-5">
    <div class="md:w-1/2 lg:w-1/3 bg-white flex justify-center">
      <VueTailwindDatepicker
        i18n="es-mx"
        as-single
        no-input
        v-model="orderStore.date"
        :formatter="format"
      />
    </div>
    <div
      class="md:w-1/2 lg:w-2/3 space-y-5 lg:h-screen lg:overflow-y-scroll p-5 pb-32 hidden-scroll"
    >
      <p class="text-center text-lg" v-if="orderStore.isDateSelect">
        Orders the selected date: {{ orderStore.date }}
      </p>
      <p v-else class="text-center text-lg">
        Select a date to view the orders of that day
      </p>
      <div class="space-y-5">
        <p class="text-right text-2xl">
          <span class="font-black">
            Total payable: {{ orderStore.totalOrdersOfDate }}
          </span>
        </p>
        <OrdersDetails
          v-for="item in orderStore.ordersCollection"
          :key="item.id"
          :orders="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import useOrderStore from "@/store/orderStore";
import { watch } from "vue";
import { storeToRefs } from "pinia";
import OrdersDetails from "@/components/OrdersDetails.vue";

const orderStore = useOrderStore();
const { date } = storeToRefs(orderStore);
const router = useRouter();
const format = ref({
  date: "DD/MM/YYYY",
  month: "MMMM",
});

watch(date, () => {
  if (orderStore.isDateSelect) {
    router.push({ query: { date: orderStore.date } });
  }
});

onMounted(() => {
  if (router.currentRoute.value.query.date) {
    orderStore.date = router.currentRoute.value.query.date as string;
  }
});
</script>
<style>
.hidden-scroll {
  scrollbar-width: none;
}
</style>
