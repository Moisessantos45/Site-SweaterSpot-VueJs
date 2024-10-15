<template>
  <nav
    class="w-full flex gap-2 lg:items-start items-center lg:justify-normal justify-center"
  >
    <LinkView to="ProductCreate">Create Product</LinkView>
    <button
      @click="couponStore.toggleModal"
      class="rounded bg-green-400 hover:bg-green-500 font-bold px-10 py-2"
    >
      Add Coupon
    </button>
  </nav>
  <div>
    <h1 class="text-3xl font-black my-5">Products</h1>
    <p v-if="productsStore.noResults">Not all products are displayed here.</p>
    <ul
      role="list"
      class="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3"
    >
      <Product
        v-for="item in productsStore.computedProducts"
        :key="item.id"
        :product="item"
      />
    </ul>
  </div>
  <CouponView />
</template>

<script setup lang="ts">
import useProductsStore from "@/store/productsStore";
import Product from "@/components/Product.vue";
import useCouponStore from "@/store/couponStore";
import LinkView from "@/components/Ui/LinkView.vue";
import CouponView from "@/components/ModalCoupon.vue";

const productsStore = useProductsStore();
const couponStore = useCouponStore();
</script>
