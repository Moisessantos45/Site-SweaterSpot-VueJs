<template>
  <header class="bg-gray-700 px-4 py-5 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div
        class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <!-- Logo -->
        <LogoView />      

        <!-- Navegación -->
        <nav class="sm:order-last">
          <LinkView
            to="Sales"
            class="text-white hover:text-gray-300 transition-colors"
          >
            Admin
          </LinkView>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import LogoView from "./Ui/LogoView.vue";
import LinkView from "./Ui/LinkView.vue";

</script>
