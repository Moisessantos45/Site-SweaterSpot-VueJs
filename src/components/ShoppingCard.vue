<template>
  <p v-if="cardStore.isEmpty" class="text-xl text-center text-gray-100">
    The shopping card is empty
  </p>
  <div v-else>
    <p class="text-4xl font-bold text-gray-100">Shopping Card</p>
    <ul class="mt-6 divide-y divide-gray-200 border-t" role="list">
      <ShoppingCardItem
        v-for="product in cardStore.productsCards"
        :key="product.id"
        :product="product"
      />
    </ul>
    <dl
      class="space-y-3 border-t border-gray-200 pt-6 text-sm font-medium text-gray-200"
    >
      <Amount>
        <template #label> Subtotal:</template>
        {{ formatCurrency(cardStore.subTotal) }}
      </Amount>
      <Amount>
        <template #label> Taxes:</template>
        {{ formatCurrency(cardStore.taxes) }}
      </Amount>

      <Amount v-if="couponStore.discountTotal > 0">
        <template #label> Discount:</template>
        {{ formatCurrency(couponStore.discountTotal) }}
      </Amount>
      <Amount>
        <template #label> Total payable:</template>
        {{ formatCurrency(cardStore.total) }}
      </Amount>
    </dl>
    <CouponForm />

    <button
      type="button"
      class="mt-5 w-full bg-green-400 text-gray-100 font-bold p-3"
      @click="cardStore.checkout"
    >
      Checkout
    </button>
  </div>
</template>

<script setup lang="ts">
import useCardStore from "@/store/cardStore";
import ShoppingCardItem from "@/components/ShoppingCardItem.vue";
import Amount from "./Ui/Amount.vue";
import CouponForm from "@/components/CouponForm.vue";
import { formatCurrency } from "../helpers";
import useCouponStore from "@/store/couponStore";

const cardStore = useCardStore();
const couponStore = useCouponStore();
</script>
