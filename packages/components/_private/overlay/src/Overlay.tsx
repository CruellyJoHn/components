/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { OverlayProps } from './types'
import type { PopperElement, PopperEvents } from '@idux/cdk/popper'
import type { ComputedRef, Ref, VNode } from 'vue'

import {
  Transition,
  cloneVNode,
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  vShow,
  watch,
  withDirectives,
} from 'vue'

import { clickOutside } from '@idux/cdk/click-outside'
import { usePopper } from '@idux/cdk/popper'
import { IxPortal } from '@idux/cdk/portal'
import { Logger, callEmit, convertElement, getFirstValidNode } from '@idux/cdk/utils'

import { overlayProps } from './types'

export default defineComponent({
  name: 'IxOverlay',
  inheritAttrs: false,
  props: overlayProps,
  setup(props, { slots, attrs, expose }) {
    const popperOptions = usePopperOptions(props)
    const {
      arrowRef,
      popperRef,
      popperEvents,
      triggerRef,
      triggerEvents,
      visibility,
      placement,
      initialize,
      update,
      forceUpdate,
      show,
      hide,
      destroy,
    } = usePopper({ ...popperOptions.value, visible: props.visible })

    onMounted(() => initialize())
    onBeforeUnmount(() => destroy())

    watch(visibility, value => callEmit(props['onUpdate:visible'], value))
    watch(placement, value => callEmit(props['onUpdate:placement'], value))
    watch(popperOptions, options => update(options))
    watch(
      () => props.visible,
      visible => (visible ? show() : hide()),
    )

    const onAfterLeave = () => {
      if (props.destroyOnHide) {
        destroy()
      }
      callEmit(props.onAfterLeave)
    }

    expose({
      updatePopper: update,
      forceUpdatePopper: forceUpdate,
    })

    return () => {
      const triggerNode = getFirstValidNode(slots.default?.())
      if (!triggerNode) {
        __DEV__ && Logger.warn('components/overlay', 'Trigger must is single rooted node')
        return null
      }
      const contentNode = slots.content?.()
      if (!getFirstValidNode(contentNode)) {
        return triggerNode
      }
      const trigger = renderTrigger(props, triggerNode, { ref: triggerRef, ...triggerEvents.value }, popperRef, hide)
      const content = renderContent(props, visibility, contentNode!, arrowRef, popperRef, popperEvents, attrs)
      return (
        <>
          {trigger}
          <IxPortal target={props.target} load={visibility.value}>
            <Transition appear name={props.transitionName} onAfterLeave={onAfterLeave}>
              {content}
            </Transition>
          </IxPortal>
        </>
      )
    }
  },
})

function usePopperOptions(props: OverlayProps) {
  return computed(() => {
    const { allowEnter, autoAdjust, delay, disabled, offset, placement, trigger } = props
    return { allowEnter, autoAdjust, delay, disabled, offset, placement, trigger }
  })
}

function renderContent(
  props: OverlayProps,
  visibility: ComputedRef<boolean>,
  contentNode: VNode[],
  arrowRef: Ref<PopperElement | null>,
  popperRef: Ref<PopperElement | null>,
  popperEvents: ComputedRef<PopperEvents>,
  attrs: Record<string, unknown>,
) {
  if (props.destroyOnHide && !visibility.value) {
    return null
  }

  const arrow = props.showArrow ? <div ref={arrowRef} class="ix-overlay-arrow"></div> : null

  const overlay = (
    <div ref={popperRef} class="ix-overlay" {...popperEvents.value} {...attrs}>
      {contentNode}
      {arrow}
    </div>
  )

  return props.destroyOnHide ? overlay : withDirectives(overlay, [[vShow, visibility.value]])
}

function renderTrigger(
  props: OverlayProps,
  triggerNode: VNode,
  extraProps: Record<string, unknown>,
  popperRef: Ref<PopperElement | null>,
  handler: () => void,
) {
  const element = cloneVNode(triggerNode, extraProps, true)
  if (props.clickOutside) {
    return withDirectives(element, [[clickOutside, { exclude: [convertElement(popperRef)], handler }]])
  }
  return element
}
