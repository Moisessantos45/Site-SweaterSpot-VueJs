<template>
  <MainNav />
  <section
    class="bg-gray-800 pt-5 lg:flex lg:h-screen lg:overflow-y-hidden relative"
  >
    <div class="w-full lg:overflow-y-scroll pb-32 px-10 hidden-scroll">
      <div class="mb-8 bg-gray-700 rounded-lg p-4 shadow-lg">
        <h2 class="text-xl font-extrabold text-white mb-4">
          Filtrar por categoría:
        </h2>
        <div class="flex flex-wrap gap-4">
          <div
            v-for="category in productsStore.categories"
            :key="category.id"
            class="flex items-center space-x-2"
          >
            <input
              type="radio"
              name="category"
              :id="'category-' + category.id"
              :value="category.id"
              class="h-5 w-5 rounded border-gray-500 text-indigo-500 focus:ring-indigo-400"
              :checked="productsStore.selectCategory === category.id"
              @change="changeCategory"
            />
            <label
              :for="'category-' + category.id"
              class="text-gray-200 text-lg hover:text-white transition-colors"
            >
              {{ category.name }}
            </label>
          </div>
        </div>
      </div>

      <p v-if="noResults" class="text-center text-4xl text-gray-400">
        No se encontraron productos
      </p>
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <span
          v-if="isDataAvailable"
          class="text-lg font-semibold text-center text-blue-600 animate-pulse"
        >
          Cargando...
        </span>
        <ProductCard
          v-else
          v-for="product in filterProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </section>
  <SliderCard />
  <Footer />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import MainNav from "../components/MainNav.vue";
import SliderCard from "@/components/SliderCard.vue";
import useProductsStore from "@/store/productsStore";
import ProductCard from "@/components/ProductCard.vue";
import Footer from "@/components/section/Footer.vue";
import { onMounted } from "vue";

const productsStore = useProductsStore();
const { filterProducts, noResults, isDataAvailable } =
  storeToRefs(productsStore);
const router = useRouter();

const changeCategory = (event: Event) => {
  if (!event.target) return;
  productsStore.selectCategory = +(event.target as HTMLInputElement).value;
  router.push({ query: { category: productsStore.selectCategory } });
};

if (router.currentRoute.value.query.category) {
  productsStore.selectCategory = +router.currentRoute.value.query.category;
}

onMounted(async () => {
  await productsStore.loadData();
});
</script>

<style>
.hidden-scroll {
  scrollbar-width: none;
}
</style>
