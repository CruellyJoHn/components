<template>
  <div class="ix-progress-line" :class="lineClasses">
    <div class="ix-progress-outer">
      <div class="ix-progress-inner">
        <div v-if="success.percent" class="ix-progress-success-bg" :style="successStyle"></div>
        <div class="ix-progress-bg" :style="bgStyle"></div>
      </div>
    </div>
    <div v-if="!hideInfo" class="ix-progress-text">
      <slot>
        <template v-if="showFormat">{{ formattedText }}</template>
        <IxIcon v-else-if="showSuccessIcon" class="ix-progress-success-icon" name="check-circle-filled" />
        <IxIcon v-else-if="showExceptionIcon" class="ix-progress-exception-icon" name="close-circle-filled" />
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'

import { isObject } from 'lodash-es'

import { convertNumber } from '@idux/cdk/utils'
import { useGlobalConfig } from '@idux/components/config'
import { IxIcon } from '@idux/components/icon'

import { convertProgressProps } from './types'
import { useInfo, useSmallSize, useStatus, useStatusClasses } from './useCommonLogic'
import { handleGradient } from './util'

const defaultStrokeWidth = 8
const defaultSmallStrokeWidth = 6

export default defineComponent({
  name: 'IxProgressLine',
  components: { IxIcon },
  props: convertProgressProps,
  setup(props) {
    const progressConfig = useGlobalConfig('progress')
    const isSmallSize = useSmallSize(props, progressConfig)
    const strokeWidth = computed(() =>
      convertNumber(props.strokeWidth ?? (isSmallSize.value ? defaultSmallStrokeWidth : defaultStrokeWidth)),
    )
    const progressStatus = useStatus(props)
    const statusClass = useStatusClasses(progressStatus)
    const { formattedText, showSuccessIcon, showExceptionIcon, showFormat } = useInfo(
      props,
      progressConfig,
      progressStatus,
    )

    const lineClasses = computed(() => {
      return [
        statusClass.value,
        props.hideInfo ? '' : 'ix-progress-show-info',
        props.strokeLinecap === 'round' ? 'ix-progress-round' : '',
        isSmallSize.value ? 'ix-progress-small' : '',
      ]
    })
    const successStyle = computed(() => ({
      height: `${strokeWidth.value}px`,
      width: `${props.success.percent}%`,
      background: props.success?.strokeColor ?? '',
    }))
    const bgStyle = computed(() => ({
      height: `${strokeWidth.value}px`,
      width: `${props.percent}%`,
      background: isObject(props.strokeColor) ? handleGradient(props.strokeColor) : props.strokeColor ?? '',
    }))

    return {
      lineClasses,
      successStyle,
      bgStyle,
      formattedText,
      showFormat,
      showSuccessIcon,
      showExceptionIcon,
    }
  },
})
</script>
