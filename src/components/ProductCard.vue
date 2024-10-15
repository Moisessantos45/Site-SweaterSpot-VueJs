<template>
  <div class="rounded shadow bg-white relative">
    <img :src="product.image" :alt="product.name" />
    <div class="p-3 space-y-2">
      <h3 class="text-xl font-black text-gray-500">
        {{ product.name }}
      </h3>
      <p class="text-gray-500">
        {{ product.stock }}
      </p>
      <p class="text-2xl font-extrabold text-gray-900">
        {{ formatCurrency(product.price) }}
      </p>
    </div>
    <button
      type="button"
      class="absolute top-5 -right-4 disabled:opacity-50"
      :disabled="product.stock === 0"
      @click="cardStore.addProduct(product)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-8 h-8 rounded-full bg-indigo-600 text-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ProductFirebase } from "@/entitis/entitis";
import { formatCurrency } from "../helpers";
import useCardStore from "@/store/cardStore";

const cardStore = useCardStore();

defineProps<{ product: ProductFirebase }>();
</script>
