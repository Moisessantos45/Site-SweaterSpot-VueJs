<template>
  <div class="min-h-screen p-4 sm:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold text-indigo-800 mb-4">Coupons List</h1>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <button
            @click="couponStore.toggleModal"
            class="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded transition duration-300"
          >
            Add Coupon
          </button>

          <div class="flex flex-wrap gap-4">
            <label
              v-for="item in options"
              :key="item.id"
              class="inline-flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                :id="'category-' + item.id"
                :value="item.id"
                v-model="couponStore.selectTypeView"
                @change="changeSelectTypeView"
                class="form-radio h-5 w-5 text-indigo-600"
              />
              <span class="ml-2 text-gray-700">{{ item.name }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Calendar Section -->
        <div class="w-full lg:w-1/3">
          <div class="bg-white rounded-lg shadow-md p-6 lg:p-2">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Select Date
            </h2>
            <VueTailwindDatepicker
              i18n="es-mx"
              as-single
              no-input
              v-model="date"
              :formatter="format"
              button-classes="bg-indigo-600 text-white hover:bg-indigo-700"
            />
          </div>
        </div>

        <!-- Coupons List Section -->
        <div class="w-full lg:w-2/3">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              {{
                isDateSelect
                  ? `Coupons redeemed on: ${date}`
                  : "Select a date to see the redeemed coupons"
              }}
            </h2>
            <div class="space-y-4">
              <div
                class="space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2"
                v-if="couponStore.couponCollectionLength"
              >
                <p class="text-right text-2xl font-bold text-indigo-800">
                  Total discounts:
                  {{ couponStore.couponCollectionLength }}
                </p>
                <CouponCard
                  v-for="coupon in couponsToDisplay"
                  :key="coupon.id"
                  :coupon="coupon"
                  class="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                />
              </div>
              <p v-else class="text-center text-gray-500">
                No coupons were redeemed on this date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalCoupon />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import useCouponStore from "@/store/couponStore";
import ModalCoupon from "@/components/ModalCoupon.vue";
import CouponCard from "@/components/CouponCard.vue";
import { watch } from "vue";

const couponStore = useCouponStore();
const { date, isDateSelect, couponsToDisplay } = storeToRefs(couponStore);

const router = useRouter();
const format = ref({
  date: "DD/MM/YYYY",
  month: "MMMM",
});

const queryUrl = reactive({
  date: "",
  type: 1,
});

const options = [
  { id: 1, name: "Created" },
  { id: 2, name: "Redeem" },
];

watch(date, () => {
  if (isDateSelect) {
    router.push({ query: { date: couponStore.date, type: queryUrl.type } });
    queryUrl.date = couponStore.date;
  }
});

const changeSelectTypeView = (event: Event) => {
  if (!event.target) return;
  const target = event.target as HTMLInputElement;
  couponStore.selectTypeView = parseInt(target.value);
  if (queryUrl.date !== "") {
    router.push({
      query: { date: queryUrl.date, type: couponStore.selectTypeView },
    });
  } else {
    router.push({ query: { type: couponStore.selectTypeView } });
  }
  queryUrl.type = couponStore.selectTypeView;
};

onMounted(() => {
  if (router.currentRoute.value.query.date) {
    couponStore.date = router.currentRoute.value.query.date as string;
  }
  if (router.currentRoute.value.query.type) {
    const typeFromQuery = parseInt(
      router.currentRoute.value.query.type as string
    );
    couponStore.selectTypeView = typeFromQuery;

    queryUrl.type = typeFromQuery;
  }
});
</script>
