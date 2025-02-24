/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import { computed, defineComponent, inject } from 'vue'

import { treeToken } from '../token'
import { treeNodeProps } from '../types'
import Checkbox from './Checkbox'
import Content from './Content'
import Expand from './Expand'
import Indent from './Indent'
import LeafLine from './LeafLine'

export default defineComponent({
  props: treeNodeProps,
  setup(props) {
    const {
      props: treeProps,
      prefixCls,
      activeKey,
      selectedKeys,
      dragKey,
      dropKey,
      dropParentKey,
      dropType,
      handleDragstart,
      handleDragend,
      handleDragenter,
      handleDragover,
      handleDragleave,
      handleDrop,
    } = inject(treeToken)!

    const key = computed(() => props.node.key)

    const isActive = computed(() => activeKey.value === key.value)
    const selected = computed(() => selectedKeys.value.includes(key.value))
    const disabled = computed(() => props.node.selectDisabled || !treeProps.selectable)

    const dragging = computed(() => dragKey.value === key.value)
    const dropping = computed(() => dropKey.value === key.value)
    const dropParent = computed(() => dropParentKey.value === key.value)
    const dropBefore = computed(() => dropping.value && dropType.value === 'before')
    const dropInside = computed(() => dropping.value && dropType.value === 'inside')
    const dropAfter = computed(() => dropping.value && dropType.value === 'after')

    const classes = computed(() => {
      const _prefixCls = `${prefixCls.value}-node`
      return {
        [_prefixCls]: true,
        [`${_prefixCls}-active`]: isActive.value,
        [`${_prefixCls}-disabled`]: disabled.value,
        [`${_prefixCls}-selected`]: selected.value,
        [`${_prefixCls}-expanded`]: props.node.expanded,
        [`${_prefixCls}-dragging`]: dragging.value,
        [`${_prefixCls}-dropping`]: dropping.value,
        [`${_prefixCls}-drop-parent`]: dropParent.value,
        [`${_prefixCls}-drop-before`]: dropBefore.value,
        [`${_prefixCls}-drop-inside`]: dropInside.value,
        [`${_prefixCls}-drop-after`]: dropAfter.value,
      }
    })

    const onDragstart = (evt: DragEvent) => {
      evt.stopPropagation()

      handleDragstart(evt, props.node)

      // for firefox
      evt.dataTransfer?.setData('text/plain', '')
    }

    const onDragend = (evt: DragEvent) => {
      evt.stopPropagation()

      handleDragend(evt, props.node)
    }

    const onDragenter = (evt: DragEvent) => {
      evt.preventDefault()
      evt.stopPropagation()
      handleDragenter(evt, props.node)
    }

    const onDragover = (evt: DragEvent) => {
      evt.preventDefault()
      evt.stopPropagation()
      handleDragover(evt, props.node)
    }

    const onDragleave = (evt: DragEvent) => {
      evt.stopPropagation()
      handleDragleave(evt, props.node)
    }

    const onDrop = (evt: DragEvent) => {
      evt.stopPropagation()
      handleDrop(evt, props.node)
    }

    return () => {
      const node = props.node
      const { isLeaf, key, level, rawNode, expanded, dragDisabled, dropDisabled } = node
      const { showLine, checkable, draggable } = treeProps
      const mergedDraggable = draggable && !dragDisabled

      return (
        <div
          {...rawNode.additional}
          class={classes.value}
          aria-grabbed={dragging.value || undefined}
          draggable={mergedDraggable || undefined}
          onDragstart={mergedDraggable ? onDragstart : undefined}
          onDragend={mergedDraggable ? onDragend : undefined}
          onDragenter={mergedDraggable ? onDragenter : undefined}
          onDragover={mergedDraggable ? onDragover : undefined}
          onDragleave={mergedDraggable ? onDragleave : undefined}
          onDrop={mergedDraggable && !dropDisabled ? onDrop : undefined}
        >
          <Indent level={level} prefixCls={prefixCls.value} />
          {!isLeaf ? <Expand expanded={expanded} nodeKey={key} rawNode={rawNode} /> : showLine && <LeafLine />}
          {checkable && <Checkbox node={node} />}
          <Content disabled={disabled.value} nodeKey={key} rawNode={rawNode} selected={selected.value} />
        </div>
      )
    }
  },
})
