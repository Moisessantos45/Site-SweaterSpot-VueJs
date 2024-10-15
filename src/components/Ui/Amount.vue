<template>
  <div class="flex justify-between p-1">
    <dt class="font-bold text-gray-200">
      <slot name="label" />
    </dt>
    <dd class="text-gray-100">
      <slot></slot>
    </dd>
  </div>
  
</template>
