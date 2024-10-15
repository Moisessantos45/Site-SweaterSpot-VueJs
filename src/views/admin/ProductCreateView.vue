<template>
  <div class="max-w-4xl mx-auto px-4 py-2">
    <LinkView
      to="Products"
      class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
    >
      &larr; Back to Products
    </LinkView>
    <h1 class="text-3xl font-bold mb-8">Create New Product</h1>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <FormKit
        type="form"
        :value="productFormData"
        @submit="handleSubmit"
        :classes="{
          form: 'space-y-6 p-6',
          messages: 'list-none p-0 mt-1 mb-0',
          message: 'text-red-500 mb-1 text-sm',
        }"
        submit-label="Add Product"
        :actions="false"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormKit
            type="text"
            name="name"
            label="Product Name"
            validation="required"
            :validation-messages="{ required: 'Product name is required' }"
            v-model.trim="productFormData.name"
          />

          <FormKit
            type="select"
            name="category"
            label="Category"
            :options="categoriesOptions"
            validation="required"
            :validation-messages="{ required: 'Category is required' }"
            v-model.number="productFormData.category"
          />

          <FormKit
            type="number"
            name="price"
            label="Price"
            validation="required|min:0"
            :validation-messages="{
              required: 'Price is required',
              min: 'Price must be 0 or greater',
            }"
            v-model.number="productFormData.price"
          />

          <FormKit
            type="number"
            name="quantity"
            label="Quantity"
            validation="required|min:0"
            :validation-messages="{
              required: 'Quantity is required',
              min: 'Quantity must be 0 or greater',
            }"
            v-model.number="productFormData.stock"
          />
        </div>

        <div class="mt-6">
          <FormKit
            type="file"
            name="image"
            label="Product Image"
            :validation="productFormData.image ? '' : 'required'"
            :validation-messages="{ required: 'Product image is required' }"
            accept="image/*"
            @change="onFileChange"
          />

          <div v-if="isImage || productFormData.image" class="mt-4">
            <p class="font-semibold mb-2">Image Preview</p>
            <img
              :src="url || productFormData.image"
              alt="Product preview"
              class="w-32 max-w-md rounded-lg shadow-sm"
            />
          </div>
        </div>

        <FormKit
          type="submit"
          label="Add Product"
          :classes="{
            input:
              'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out',
          }"
        />
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
import LinkView from "@/components/Ui/LinkView.vue";
import showToastNotification from "@/services/notifications";
import useImage from "@/services/useImage";
import useProductsStore from "@/store/productsStore";
import { storeToRefs } from "pinia";
import { reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const { onFileChange, url, isImage } = useImage();
const storeProducts = useProductsStore();
const { categoriesOptions, selectProduct } = storeToRefs(storeProducts);

const router = useRouter();
const route = useRoute();

const paramsId = route.params.id;

const productFormData = reactive({
  name: "",
  image: "",
  category: "",
  price: "",
  stock: "",
});
if (paramsId && typeof paramsId === "string") {
  storeProducts.queryProductById(paramsId);
}
watch(
  () => selectProduct.value,
  () => {
    if (selectProduct) {
      productFormData.name = selectProduct.value.name;
      productFormData.category = selectProduct.value.category.toString();
      productFormData.price = selectProduct.value.price.toString();
      productFormData.stock = selectProduct.value.stock.toString();
      productFormData.image = selectProduct.value.image;
    }
  },
  {
    immediate: true,
  }
);

const handleSubmit = async () => {
  if (
    storeProducts.validateIsNumber(productFormData.price) ||
    storeProducts.validateIsNumber(productFormData.stock) ||
    storeProducts.validateIsNumber(productFormData.category)
  ) {
    showToastNotification(
      "The price, quantity and category must be numbers",
      false
    );
    return;
  }
  const finalData = {
    name: productFormData.name,
    image: url.value || productFormData.image,
    category: parseInt(productFormData.category),
    price: parseInt(productFormData.price),
    stock: parseInt(productFormData.stock),
  };

  if (paramsId && typeof paramsId === "string") {
    await storeProducts.updateProduct(paramsId, finalData);
    showToastNotification("Product updated successfully", true);
    router.push({ name: "Products" });
    return;
  }
  await storeProducts.addProduct(finalData);
  router.push({ name: "Products" });
};
</script>
