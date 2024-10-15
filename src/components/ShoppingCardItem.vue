<template>
  <li class="flex space-x-6 py-6">
    <img
      :src="product.image"
      :alt="product.image"
      class="w-24 h-24 flex-none rounded-md"
    />
    <div class="flex-auto space-y-2 relative">
      <button
        type="button"
        class="absolute top-5 right-3"
        @click="cardStore.removeProduct(product.id)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-red-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
      <h3 class="text-gray-200">
        {{ product.name }}
      </h3>
      <p class="text-gray-200">
        {{ formatCurrency(product.price) }}
      </p>
      <select
        class="w-24 text-center p-2 bg-white rounded-lg"
        @change="($event) => changeQuantity($event, product.id)"
        :value="product.quantity"
      >
        <option v-for="n in cardStore.checkQuantity(product)" :value="n">
          {{ n }}
        </option>
      </select>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ProductCardStores } from "@/entitis/entitis";
import { formatCurrency } from "../helpers";
import useCardStore from "@/store/cardStore";
import useProductsStore from "@/store/productsStore";

defineProps<{ product: ProductCardStores }>();

const cardStore = useCardStore();
const productsStore = useProductsStore();

const changeQuantity = (event: Event, id: string) => {
  if (!event.target) return;
  if (
    productsStore.validateIsNumber((event.target as HTMLSelectElement).value)
  ) {
    return;
  }
  const quantity = +(event.target as HTMLSelectElement).value;
  cardStore.updateQuantity(id, quantity);
};
</script>
