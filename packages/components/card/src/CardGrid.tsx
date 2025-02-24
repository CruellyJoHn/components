/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import { computed, defineComponent, inject } from 'vue'

import { IxCol } from '@idux/components/grid'

import { cardToken } from './token'
import { cardGridProps } from './types'

export default defineComponent({
  name: 'IxCardGrid',
  props: cardGridProps,
  setup(props) {
    const { hoverable } = inject(cardToken)!

    const classes = computed(() => {
      return {
        'ix-card-grid': true,
        'ix-card-grid-hoverable': props.hoverable ?? hoverable.value,
      }
    })

    return { classes }
  },
  render() {
    return <IxCol class={this.classes}>{this.$slots.default?.()}</IxCol>
  },
})
