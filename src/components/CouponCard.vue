<template>
  <div
    class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow duration-300"
  >
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-sm sm:text-lg font-semibold text-gray-900">
          {{ coupon.nameCoupon }}
        </h3>
        <!-- <p class="text-xs sm:text-sm text-gray-600">
          Usages: {{ coupon.usage_dates }}
        </p> -->
      </div>
      <span
        class="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
      >
        {{ couponStore.selectTypeView == 1 ? "Activo" : "Canjeado" }}
      </span>
    </div>

    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p class="text-xs sm:text-sm font-medium text-gray-500">Descuento</p>
        <p class="mt-1 text-sm sm:text-lg font-semibold text-indigo-600">
          {{ formatDiscount(coupon.discount) }}
        </p>
      </div>
      <div>
        <p class="text-xs sm:text-sm font-medium text-gray-500">Categoría</p>
        <p class="mt-1 text-sm sm:text-lg font-semibold text-gray-900">
          {{ coupon.category }}
        </p>
      </div>
    </div>

    <div class="mt-4">
      <p class="text-xs sm:text-sm font-medium text-gray-500">
        Quantity available
      </p>
      <p class="mt-1 text-sm sm:text-lg font-semibold text-gray-900">
        {{ coupon.quantity }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CouponFirebase,
  UsageCouponFirebaseWithCoupon,
} from "@/entitis/entitis";
import useCouponStore from "@/store/couponStore";

const couponStore = useCouponStore();
defineProps<{
  coupon: CouponFirebase | UsageCouponFirebaseWithCoupon;
}>();

const formatDiscount = (discount: number) => {
  return discount < 1 ? `${discount * 100}%` : `$${discount.toFixed(2)}`;
};
</script>
