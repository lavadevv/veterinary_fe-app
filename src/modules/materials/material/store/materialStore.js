import { defineStore } from "pinia";
import * as materialService from "../services/material.service";

export const useMaterialStore = defineStore("material", {
  state: () => ({
    materials: [],
    loading: false,
  }),
  actions: {
    async fetchMaterials() {
      this.loading = true;
      try {
        const res = await materialService.getMaterials();
        this.materials = res.data;
      } finally {
        this.loading = false;
      }
    },
  },
});
