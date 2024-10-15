<template>
    <AdminNav />
    <main class=" container sm:w-11/12 lg:container mx-auto p-2 lg:min-h-screen mt-5">
        <RouterView />
    </main>
</template>

<script setup lang="ts">
import AdminNav from '../components/AdminNav.vue';

</script>