/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { IxInnerPropTypes, IxPublicPropTypes } from '@idux/cdk/utils'
import type { DefineComponent, HTMLAttributes } from 'vue'

import { IxPropTypes } from '@idux/cdk/utils'

export type CollapseTransitionMode = 'height' | 'width'

export const collapseTransitionProps = {
  appear: IxPropTypes.bool.def(false),
  name: IxPropTypes.string.def('ix-collapse-transition'),
  mode: IxPropTypes.oneOf<CollapseTransitionMode>(['height', 'width']).def('height'),
  onAfterEnter: IxPropTypes.emit(),
  onAfterLeave: IxPropTypes.emit(),
}

export type CollapseTransitionProps = IxInnerPropTypes<typeof collapseTransitionProps>
export type CollapseTransitionPublicProps = IxPublicPropTypes<typeof collapseTransitionProps>
export type CollapseTransitionComponent = DefineComponent<
  Omit<HTMLAttributes, keyof CollapseTransitionPublicProps> & CollapseTransitionPublicProps
>
export type CollapseTransitionInstance = InstanceType<DefineComponent<CollapseTransitionProps>>
