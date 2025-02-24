/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { ModalInstance, ModalOptions, ModalRef } from './types'

import { cloneVNode, defineComponent, isVNode, provide, shallowRef } from 'vue'

import { callEmit, convertArray, noop, uniqueId } from '@idux/cdk/utils'

import Modal from './Modal'
import { modalProviderToken } from './token'

export default defineComponent({
  name: 'IxModalProvider',
  setup(_, { expose, slots }) {
    const { modals, apis } = useModalApis()
    provide(modalProviderToken, apis)
    expose(apis)

    return () => {
      const children = modals.value.map(item => {
        const { content, contentProps, ...rest } = item
        const contentNode = isVNode(content) ? cloneVNode(content, contentProps, true) : content
        return <Modal {...rest}>{contentNode}</Modal>
      })
      return (
        <>
          {slots.default?.()}
          {children}
        </>
      )
    }
  },
})

function useModal() {
  const modals = shallowRef<Array<ModalOptions & { ref?: (instance: unknown) => void }>>([])
  const modalRefMap = new Map<string, ModalRef>()

  const setModalRef = (key: string, instance: ModalInstance | null) => {
    const ref = modalRefMap.get(key)
    if (instance) {
      if (ref && !ref.open) {
        ref.open = instance.open
        ref.close = instance.close
        ref.cancel = instance.cancel
        ref.ok = instance.ok
      }
    } else {
      if (ref) {
        modalRefMap.delete(key)
        ref.open = noop
        ref.close = noop as (evt?: unknown) => Promise<void>
        ref.cancel = noop as (evt?: unknown) => Promise<void>
        ref.ok = noop as (evt?: unknown) => Promise<void>
      }
    }
  }

  const getCurrIndex = (key: string) => {
    return modals.value.findIndex(message => message.key === key)
  }

  const add = (item: ModalOptions) => {
    const currIndex = item.key ? getCurrIndex(item.key) : -1
    const tempModals = [...modals.value]
    if (currIndex !== -1) {
      tempModals.splice(currIndex, 1, item)
      modals.value = tempModals
      return item.key!
    }
    // The default value for `visible`
    const { key = uniqueId('ix-modal'), visible = true, destroyOnHide, ...rest } = item
    const setRef = (instance: unknown) => setModalRef(key, instance as ModalInstance | null)
    const onAfterClose = destroyOnHide ? () => destroy(key) : undefined
    tempModals.push({ ...rest, key, visible, ref: setRef, onAfterClose })
    modals.value = tempModals
    return key
  }

  const update = (key: string, item: ModalOptions) => {
    const currIndex = getCurrIndex(key)
    if (currIndex !== -1) {
      const tempModals = [...modals.value]
      const newItem = { ...modals.value[currIndex], ...item }
      tempModals.splice(currIndex, 1, newItem)
      modals.value = tempModals
    }
  }

  const destroy = (key: string | string[]) => {
    const keys = convertArray(key)
    keys.forEach(key => {
      const currIndex = getCurrIndex(key)
      if (currIndex !== -1) {
        const tempModals = [...modals.value]
        const item = tempModals.splice(currIndex, 1)
        modals.value = tempModals
        callEmit(item[0].onDestroy, key)
      }
    })
  }

  const destroyAll = () => {
    modals.value = []
  }

  return { modals, modalRefMap, add, update, destroy, destroyAll }
}

function useModalApis() {
  const { modals, modalRefMap, add, update, destroy, destroyAll } = useModal()

  const open = (options: ModalOptions): ModalRef => {
    const key = add(options)
    const modalRef = {
      key,
      update: (options: ModalOptions) => update(key, options),
      destroy: () => destroy(key),
    } as ModalRef
    modalRefMap.set(key, modalRef)
    return modalRef
  }

  const modalTypes = ['confirm', 'info', 'success', 'warning', 'error'] as const
  const [confirm, info, success, warning, error] = modalTypes.map(type => {
    return (options: Omit<ModalOptions, 'type'>) => open({ ...options, type })
  })

  const apis = { open, confirm, info, success, warning, error, update, destroy, destroyAll }

  return { modals, apis }
}
