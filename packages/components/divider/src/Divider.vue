<template>
  <div class="ix-divider" :class="className">
    <span v-if="withText" class="ix-divider-inner-text">
      <slot />
    </span>
  </div>
</template>
<script lang="ts">
import type { DividerProps } from './types'
import type { DividerConfig } from '@idux/components/config'
import type { ComputedRef } from 'vue'

import { computed, defineComponent } from 'vue'

import { hasSlot } from '@idux/cdk/utils'
import { useGlobalConfig } from '@idux/components/config'

import { dividerProps } from './types'

export default defineComponent({
  name: 'IxDivider',
  props: dividerProps,
  setup(props, { slots }) {
    const dividerConfig = useGlobalConfig('divider')
    const withText = computed(() => hasSlot(slots))
    const className = useClassName(props, dividerConfig, withText)

    return { className, withText }
  },
})

function useClassName(props: DividerProps, config: DividerConfig, withText: ComputedRef<boolean>) {
  return computed(() => {
    const position = props.position || config.position
    const type = props.type || config.type
    const dashed = props.dashed || config.dashed
    const plain = props.plain || config.plain

    return [
      `ix-divider-${type}`,
      {
        'ix-divider-with-text': withText.value,
        'ix-divider-dashed': dashed,
        'ix-divider-plain': plain && withText.value,
        [`ix-divider-with-text-${position}`]: type === 'horizontal' && withText.value,
      },
    ]
  })
}
</script>
