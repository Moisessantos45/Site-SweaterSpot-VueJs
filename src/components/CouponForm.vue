<template>
  <p class="mt-5 py-5 font-bold border-t border-gray-200 text-slate-200">
    Do you have a coupon?
  </p>
  <div class="flex">
    <input
      type="text"
      placeholder="add coupon"
      class="p-2 border-gray-300 w-full"
      v-model="couponStore.couponInput"
    />
    <button
      type="button"
      class="p-3 bg-green-400 font-bold"
      @click="couponStore.verifyCoupon"
      :disabled="couponStore.isValidCoupon"
    >
      Apply
    </button>
  </div>
  <p class="font-bold text-slate-200" v-if="couponStore.isValid">
    {{ couponStore.isValid }}
  </p>
</template>

<script setup lang="ts">
import useCouponStore from "@/store/couponStore";

const couponStore = useCouponStore();
</script>
