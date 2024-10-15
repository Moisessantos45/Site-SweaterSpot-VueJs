<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    :class="{ hidden: !storeCoupon.isVisibleModal }"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
      <div class="flex justify-between items-center p-3 bg-gray-50 border-b">
        <h2 class="text-xl font-semibold text-gray-700">Add Coupon</h2>
        <button
          @click="storeCoupon.toggleModal"
          class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span class="sr-only">Close</span>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <FormKit
        type="form"
        :value="couponFormData"
        @submit="handleSubmit"
        :classes="{
          form: 'p-6 space-y-6',
          messages: 'list-none p-0 mt-1 mb-0',
          message: 'text-red-500 text-sm',
        }"
        :actions="false"
      >
        <div class="grid grid-cols-1 gap-2">
          <FormKit
            type="text"
            name="nameCoupon"
            label="Coupon Name"
            validation="required"
            :validation-messages="{ required: 'Coupon name is required' }"
            v-model="couponFormData.nameCoupon"
            :classes="{
              outer: 'space-y-2',
              label: 'block text-sm font-medium text-gray-700',
              input:
                'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
            }"
          />
          <FormKit
            type="number"
            name="discount"
            label="Discount"
            validation="required|min:0|max:100"
            :validation-messages="{
              required: 'Discount is required',
              min: 'Discount must be at least 0',
              max: 'Discount cannot exceed 100',
            }"
            v-model.number="couponFormData.discount"
            :classes="{
              outer: 'space-y-2',
              label: 'block text-sm font-medium text-gray-700',
              input:
                'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
            }"
          />
          <FormKit
            type="number"
            name="quantity"
            label="Quantity"
            validation="required|min:1"
            :validation-messages="{
              required: 'Quantity is required',
              min: 'Quantity must be at least 1',
            }"
            v-model.number="couponFormData.quantity"
            :classes="{
              outer: 'space-y-2',
              label: 'block text-sm font-medium text-gray-700',
              input:
                'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
            }"
          />
          <FormKit
            type="select"
            name="category"
            label="Category"
            :options="categoriesOptions"
            validation="required"
            :validation-messages="{ required: 'Category is required' }"
            v-model="couponFormData.category"
            :classes="{
              outer: 'space-y-2',
              label: 'block text-sm font-medium text-gray-700',
              input:
                'mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
            }"
          />
        </div>
        <div class="mt-2 flex items-center justify-end gap-5">
          <button
            @click="storeCoupon.toggleModal"
            type="button"
            class="bg-white py-2 px-4 border mb-2 border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <FormKit
            type="submit"
            :classes="{
              input:
                'inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
            }"
          >
            Add Coupon
          </FormKit>
        </div>
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
import useCouponStore from "@/store/couponStore";
import useProductsStore from "@/store/productsStore";
import { storeToRefs } from "pinia";
import { reactive } from "vue";
import { validateIsNumber } from "../helpers";
import showToastNotification from "@/services/notifications";

const storeCoupon = useCouponStore();
const storeProducts = useProductsStore();
const { categoriesOptions } = storeToRefs(storeProducts);

const couponFormData = reactive({
  nameCoupon: "",
  category: "",
  discount: "",
  quantity: "",
});

const handleSubmit = async () => {
  if (
    validateIsNumber(couponFormData.discount) ||
    validateIsNumber(couponFormData.quantity) ||
    validateIsNumber(couponFormData.category)
  ) {
    showToastNotification("Please enter a valid number", false);
    return;
  }
  const finalData = {
    nameCoupon: couponFormData.nameCoupon,
    category: Number(couponFormData.category),
    discount: Number(couponFormData.discount),
    quantity: Number(couponFormData.quantity),
  };
  await storeCoupon.createCoupon(finalData);
  storeCoupon.toggleModal();
};
</script>
