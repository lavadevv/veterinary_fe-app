<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Nguyên liệu</h1>
    <div v-if="loading">Đang tải...</div>
    <ul v-else>
      <li v-for="m in materials" :key="m.id" class="p-2 border-b">
        {{ m.name }} - SL: {{ m.quantity }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useMaterialStore } from "../store/materialStore";
import { storeToRefs } from "pinia";

const store = useMaterialStore();
const { materials, loading } = storeToRefs(store);

onMounted(() => store.fetchMaterials());
</script>
