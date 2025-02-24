<template>
  <span class="ix-badge-wrapper">
    <slot />
    <sup class="ix-badge" :class="classes" :style="styles">
      <slot v-if="hasCountSlot" name="count" />
      <template v-else-if="countValue">{{ countValue }}</template>
    </sup>
  </span>
</template>
<script lang="ts">
import type { BadgeProps } from './types'
import type { ComputedRef } from 'vue'

import { computed, defineComponent } from 'vue'

import { convertNumber, hasSlot, isNumeric } from '@idux/cdk/utils'
import { useGlobalConfig } from '@idux/components/config'

import { backTopProps } from './types'

export default defineComponent({
  name: 'IxBadge',
  props: backTopProps,
  setup(props, { slots }) {
    const badgeConfig = useGlobalConfig('badge')

    const showZero = computed(() => props.showZero ?? badgeConfig.showZero)
    const dot = computed(() => props.dot ?? badgeConfig.dot)
    const overflowCount = computed(() => props.overflowCount ?? badgeConfig.overflowCount)

    const hasDefaultSlot = computed(() => hasSlot(slots))
    const hasCountSlot = computed(() => hasSlot(slots, 'count'))

    const classes = useClasses(props, hasDefaultSlot, hasCountSlot, showZero, dot)
    const styles = useStyles(props, hasCountSlot, dot)
    const countValue = useCountValue(props, hasCountSlot, showZero, dot, overflowCount)

    return {
      classes,
      styles,
      countValue,
      hasCountSlot,
    }
  },
})

const useCountValue = (
  props: BadgeProps,
  hasCountSlot: ComputedRef<boolean>,
  showZero: ComputedRef<boolean>,
  dot: ComputedRef<boolean>,
  overflowCount: ComputedRef<string | number>,
) => {
  return computed(() => {
    if (!hasCountSlot.value && !dot.value) {
      if (!showZero.value && +props.count === 0) {
        return false
      }
      if (isNumeric(props.count)) {
        return props.count > convertNumber(overflowCount.value, Number.MAX_VALUE)
          ? `${overflowCount.value}+`
          : `${props.count}`
      }
      return props.count
    }
    return false
  })
}

const useStyles = (props: BadgeProps, hasCountSlot: ComputedRef<boolean>, dot: ComputedRef<boolean>) => {
  return computed(() => {
    const color = props.color ?? ''
    if (hasCountSlot.value) {
      return { color }
    } else if (dot.value) {
      return { backgroundColor: color }
    } else {
      return { backgroundColor: color }
    }
  })
}

const useClasses = (
  props: BadgeProps,
  hasDefaultSlot: ComputedRef<boolean>,
  hasCountSlot: ComputedRef<boolean>,
  showZero: ComputedRef<boolean>,
  dot: ComputedRef<boolean>,
) => {
  return computed(() => {
    return {
      'ix-badge-empty': !hasDefaultSlot.value,
      'ix-badge-slot-count': hasCountSlot.value,
      'ix-badge-dot': !hasCountSlot.value && dot.value,
      'ix-badge-count': !hasCountSlot.value && !dot.value,
      'ix-badge-hide-zero': !hasCountSlot.value && !dot.value && !showZero.value && +props.count === 0,
    }
  })
}
</script>
