<template>
  <IxRate v-model:value="value" allowClear />
</template>
<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  setup() {
    const value = ref(3)

    return {
      value,
    }
  },
})
</script>
