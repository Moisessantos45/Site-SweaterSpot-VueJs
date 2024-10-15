<template>
  <div class="border-t border-gray-200 space-y-6 py-6">
    <h1 class="text-2xl font-black">Order Details:</h1>
    <p class="text-xl font-black text-gray-500">
      Orders the selected date: {{ orders.createdAt }}
    </p>
    <ul
      class="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
      role="list"
    >
      <li
        class="flex space-x-6 py-6"
        v-for="item in orders.products"
        :key="item.id"
      >
        <img
          :src="item.image"
          :alt="item.image"
          class="w-24 rounded-lg flex-none"
        />
        <div class="flex-auto space-y-2">
          <h3 class="text-gray-900">
            {{ item.name }}
          </h3>
          <p>
            {{ formatCurrency(item.price) }}
          </p>
          <p>Quantity: {{ item.quantity }}</p>
        </div>
      </li>
    </ul>
    <dl
      class="space-y-3 border-t border-gray-200 pt-6 text-sm font-medium text-gray-200"
    >
      <Amount>
        <template #label> Subtotal:</template>
        {{ formatCurrency(orders.subTotal) }}
      </Amount>
      <Amount>
        <template #label> Taxes:</template>
        {{ formatCurrency(orders.taxes) }}
      </Amount>

      <Amount v-if="orders.discount > 0" class="bg-green-200 p-2">
        <template #label> Discount:</template>
        {{ formatCurrency(orders.discount) }}
      </Amount>

      <Amount class="text-gray-800">
        <template #label> Total payable:</template>
        {{ formatCurrency(orders.total) }}
      </Amount>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { Orders } from "@/entitis/entitis";
import { formatCurrency } from "@/helpers/index";
import Amount from "@/components/Ui/Amount.vue";

defineProps<{ orders: Orders }>();
</script>
