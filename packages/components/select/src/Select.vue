<template>
  <div ref="triggerRef" v-click-outside="onClickOutside" :class="classes" @click="onClick">
    <div class="ix-select-selector" @keydown="onKeyDown">
      <SelectItem
        v-for="item in selectedItems"
        v-show="showItem"
        :key="item.value"
        :removeable="multiple && !item.isMax"
        :disabled="disabled$$ || item.disabled"
        :label="item.label"
        @delete="onItemDelete(item)"
      >
        <slot v-if="item.isMax" name="customMaxLabel" :option="item"></slot>
        <slot v-else name="customLabel" :option="item"></slot>
      </SelectItem>
      <SelectInput
        ref="selectInput"
        :value="inputValue"
        :autofocus="autofocus"
        :disabled="disabled$$"
        :open="open"
        :showInput="multiple || searchable || inputable"
        :showMirror="multiple"
        @change="onInputValueChange"
        @input="$emit('input', $event)"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
        @focus="onFocus"
        @blur="onBlur"
      />
      <div v-if="showPlaceholder" class="ix-select-placeholder">
        <slot name="placeholder">{{ placeholder }}</slot>
      </div>
    </div>
    <div v-if="suffix || $slots.suffix || !multiple" class="ix-select-suffix">
      <slot name="suffix"><IxIcon :name="suffixIcon" /></slot>
    </div>
    <div v-if="clearable && !disabled$$ && selectedItems.length" class="ix-select-clear" @click.stop="onClear">
      <IxIcon name="close-circle" />
    </div>
    <IxPortal target="ix-select-container">
      <transition>
        <SelectOptionContainer
          v-show="visibility"
          ref="overlayRef"
          :class="overlayClass"
          :style="{ minWidth: overlayMinWidth, maxHeight: overlayMaxHeight }"
          :options="normalOptions"
          :empty="empty"
        >
          <slot />
          <template #empty><slot name="empty" /></template>
        </SelectOptionContainer>
      </transition>
    </IxPortal>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SelectOptionProps } from './types'

import { computed, defineComponent, ref, watch } from 'vue'

import { clickOutside } from '@idux/cdk/click-outside'
import { IxPortal } from '@idux/cdk/portal'
import { useGlobalConfig } from '@idux/components/config'
import { IxIcon } from '@idux/components/icon'

import SelectInput from './SelectInput.vue'
import SelectItem from './SelectItem.vue'
import SelectOptionContainer from './SelectOptionContainer.vue'
import { selectProps } from './types'
import {
  useSelectClasses,
  useSelectInput,
  useSelectOptions,
  useSelectOverlay,
  useSelectProvider,
  useSelectValueAccessor,
} from './useSelect'

export default defineComponent({
  name: 'IxSelect',
  components: { IxPortal, IxIcon, SelectItem, SelectInput, SelectOptionContainer },
  directives: { clickOutside },
  props: selectProps,
  emits: [
    'update:value',
    'update:open',
    'blur',
    'change',
    'clear',
    'focus',
    'scrollToBottom',
    'compositionstart',
    'compositionend',
    'input',
    'inputChange',
  ],
  setup(props, { emit }) {
    const config = useGlobalConfig('select')
    const selectedOptions = ref<SelectOptionProps[]>([])

    const { visibility, show, hide, ...overlayBindings } = useSelectOverlay(props)
    const normalOptions = useSelectOptions(props, config)
    const {
      disabled: disabled$$,
      inputValue,
      activatedValue,
      selectedValue,
      isActive,
      ...accessorBindings
    } = useSelectValueAccessor(props)
    const classes = useSelectClasses(props, config, visibility, isActive, disabled$$)
    const { selectInput, focus, blur, clear } = useSelectInput()
    useSelectProvider(props, inputValue, activatedValue, selectedValue, selectedOptions, hide, focus, clear)

    const selectedItems = computed(() => {
      const maxLabelCount = props.maxLabelCount
      const options = selectedOptions.value
      const items: Array<SelectOptionProps & { isMax?: boolean }> = options.slice(0, maxLabelCount)
      if (options.length > maxLabelCount) {
        const label = `+ ${options.length - maxLabelCount} ...`
        const value = options.slice(maxLabelCount)
        items.push({ label, value, disabled: false, isMax: true })
      }
      return items
    })

    const onClickOutside = () => hide()

    const onClick = () => {
      if (disabled$$.value) {
        return
      }
      if (props.multiple) {
        focus()
      }
      if (visibility.value && (props.searchable || props.multiple)) {
        return
      }
      visibility.value ? hide() : show()
    }

    const onKeyDown = (evt: KeyboardEvent) => {
      // TODO support select with directional keyboard
      console.log('Todo onKeyDown', evt)
    }

    watch(visibility, isOpen => {
      if (!isOpen) {
        clear()
      }
      emit('update:open', isOpen)
    })

    const suffixIcon = computed(() => {
      const suffix = props.suffix
      if (suffix) {
        return suffix
      } else {
        return props.searchable && isActive.value ? 'search' : 'down'
      }
    })

    return {
      disabled$$,
      focus,
      blur,
      onClickOutside,
      classes,
      onClick,
      onKeyDown,
      selectedItems,
      selectInput,
      inputValue,
      suffixIcon,
      visibility,
      normalOptions,
      ...overlayBindings,
      ...accessorBindings,
    }
  },
})
</script>
