<template>
  <IxSpace direction="vertical">
    <IxCheckboxGroup v-model:value="value" :options="options" />
    <IxCheckboxGroup v-model:value="value" :options="options" buttoned />
  </IxSpace>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref(['option1', 'option2', 'option3'])
    const options = [
      { label: '选项一', value: 'option1' },
      { label: '选项二', value: 'option2' },
      { label: '选项三', value: 'option3' },
    ]
    return {
      value,
      options,
    }
  },
})
</script>
<style lang="less" scoped></style>
