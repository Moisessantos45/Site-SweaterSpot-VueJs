<template>
  <!-- Carrito -->
  <button
    @click="toggleCart"
    class="fixed right-4 z-50 bg-indigo-500 text-white p-2 rounded-full"
    :class="{ 'top-10': isCartOpen, 'top-20': !isCartOpen }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  </button>
  <aside
    class="fixed z-20 top-0 right-0 h-screen"
    :class="[
      'lg:w-1/3 w-full lg:overflow-y-scroll pt-10 pb-32 px-10 bg-gray-700 hidden-scroll',
      'inset-y-0 right-0 transform transition-transform duration-300 ease-in-out',
      { 'translate-x-full': !isCartOpen },
    ]"
  >
    <ShoppingCard />
  </aside>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ShoppingCard from "./ShoppingCard.vue";

const isCartOpen = ref(false);

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value;
};
</script>

<style>
.hidden-scroll {
  scrollbar-width: none;
}
</style>
