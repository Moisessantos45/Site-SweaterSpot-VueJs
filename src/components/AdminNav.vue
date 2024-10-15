<template>
  <header
    class="w-full relative top-0 left-0 px-5 py-3 bg-gray-700 flex justify-between items-center z-10 md:px-10 md:py-5"
  >
    <LogoView />
    <button @click="toggleMenu" class="text-white md:hidden">
      <!-- Ícono de menú para dispositivos móviles -->
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
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
    <nav
      :class="`md:flex ${isMenuOpen ? 'block' : 'hidden'}`"
      class="absolute md:static top-16 left-0 w-full bg-gray-700 md:w-auto md:bg-transparent"
    >
      <RouterLink
        :to="{ name: 'Products' }"
        class="block md:inline-block rounded text-white font-bold p-2"
      >
        Products
      </RouterLink>
      <RouterLink
        :to="{ name: 'Sales' }"
        class="block md:inline-block rounded text-white font-bold p-2"
      >
        Sales
      </RouterLink>
      <RouterLink
        :to="{ name: 'Coupons' }"
        class="block md:inline-block rounded text-white font-bold p-2"
      >
        Coupons
      </RouterLink>
      <LinkView
        to="Home"
        class="block md:inline-block rounded text-white font-bold p-2"
      >
        Home
      </LinkView>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LogoView from "./Ui/LogoView.vue";
import LinkView from "./Ui/LinkView.vue";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>
