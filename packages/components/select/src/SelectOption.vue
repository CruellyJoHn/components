<template>
  <div v-show="visible" :class="classes" @mouseenter="onMouseEnter" @click.stop="onClick">
    <span v-if="showCheckbox" class="ix-option-checkbox">
      <IxCheckbox :checked="selected" :disabled="disabled" readonly />
    </span>
    <span class="ix-option-label">
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>
<script lang="ts">
import type { SelectFilterFn, SelectOptionProps } from './types'

import { computed, defineComponent, inject, nextTick, onUnmounted, watch } from 'vue'

import { isFunction } from 'lodash-es'

import { IxCheckbox } from '@idux/components/checkbox'

import { selectToken, visibleChangeToken } from './token'
import { selectOptionProps } from './types'

const defaultFilterFn: SelectFilterFn = (value: string, option: SelectOptionProps) => {
  return option.label.toLowerCase().includes(value.toLowerCase())
}

export default defineComponent({
  name: 'IxSelectOption',
  components: { IxCheckbox },
  props: selectOptionProps,
  setup(props) {
    const {
      selectProps,
      inputValue,
      activatedValue,
      activateHandler,
      selectedValue,
      selectHandler,
      selectOptionHandler,
    } = inject(selectToken) || {}

    const visible = computed(() => {
      const searchValue = inputValue?.value
      const filterOption = selectProps?.filterOption
      if (searchValue && filterOption) {
        const filterFn = (isFunction(filterOption) ? filterOption : defaultFilterFn) as SelectFilterFn
        return filterFn(searchValue, props)
      } else {
        return true
      }
    })

    const active = computed(() => selectProps?.compareWith(activatedValue?.value, props.value))
    const selected = computed(() => !!selectedValue?.value.some(item => selectProps?.compareWith(item, props.value)))

    watch(selected, value => nextTick(() => selectOptionHandler?.(value, props)), { immediate: visible.value })

    const classes = computed(() => {
      const _disabled = props.disabled
      return {
        'ix-option': true,
        'ix-option-disabled': _disabled,
        'ix-option-active': !_disabled && active.value,
        'ix-option-selected': !_disabled && selected.value,
      }
    })

    const showCheckbox = computed(() => selectProps?.multiple)

    const onMouseEnter = () => {
      if (!props.disabled) {
        activateHandler?.(props.value)
      }
    }

    const onClick = () => {
      if (!props.disabled) {
        selectHandler?.(props.value)
      }
    }

    const visibleChange = inject(visibleChangeToken)
    watch(visible, value => nextTick(() => visibleChange?.(value)), { immediate: true })
    onUnmounted(() => {
      if (visible.value) {
        visibleChange?.(false)
      }
    })

    return { visible, classes, showCheckbox, selected, onMouseEnter, onClick }
  },
})
</script>
