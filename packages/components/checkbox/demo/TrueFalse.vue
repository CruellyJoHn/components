<template>
  <IxCheckbox v-model:checked="checked" trueValue="yes" falseValue="no" label="选项" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const checked = ref('yes')

    return {
      checked,
    }
  },
})
</script>
