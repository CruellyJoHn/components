/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { IxInnerPropTypes, IxPublicPropTypes } from '@idux/cdk/utils'
import type { DefineComponent, HTMLAttributes } from 'vue'

import { IxPropTypes } from '@idux/cdk/utils'

export type SpaceAlign = 'start' | 'center' | 'end' | 'baseline'
export type SpaceDirection = 'vertical' | 'horizontal'
export type SpaceSize = 'small' | 'medium' | 'large' | number

const spaceSizeProp = IxPropTypes.oneOf<SpaceSize>(['small', 'medium', 'large'])

export const spaceProps = {
  align: IxPropTypes.oneOf<SpaceAlign>(['start', 'center', 'end', 'baseline']).def('baseline'),
  direction: IxPropTypes.oneOf<SpaceDirection>(['vertical', 'horizontal']).def('horizontal'),
  size: IxPropTypes.oneOfType([spaceSizeProp, Number, IxPropTypes.array<SpaceSize>()]),
  split: IxPropTypes.string,
  wrap: IxPropTypes.bool,
}

export type SpaceProps = IxInnerPropTypes<typeof spaceProps>
export type SpacePublicProps = IxPublicPropTypes<typeof spaceProps>
export type SpaceComponent = DefineComponent<Omit<HTMLAttributes, keyof SpacePublicProps> & SpacePublicProps>
export type SpaceInstance = InstanceType<DefineComponent<SpaceProps>>
