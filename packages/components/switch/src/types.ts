/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { IxInnerPropTypes, IxPublicPropTypes } from '@idux/cdk/utils'
import type { DefineComponent, HTMLAttributes } from 'vue'

import { controlPropDef } from '@idux/cdk/forms'
import { IxPropTypes } from '@idux/cdk/utils'

export const switchProps = {
  autofocus: IxPropTypes.bool.def(false),
  checked: IxPropTypes.bool.def(false),
  control: controlPropDef,
  disabled: IxPropTypes.bool.def(false),
  checkedChildren: IxPropTypes.string.def(''),
  unCheckedChildren: IxPropTypes.string.def(''),
  size: IxPropTypes.oneOf(['md', 'sm'] as const).def('md'),
  loading: IxPropTypes.bool.def(false),

  // events
  'onUpdate:checked': IxPropTypes.emit<(checked: boolean) => void>(),
  onChange: IxPropTypes.emit<(checked: boolean) => void>(),
  onBlur: IxPropTypes.emit<(evt: FocusEvent) => void>(),
}

export type SwitchProps = IxInnerPropTypes<typeof switchProps>
export type SwitchPublicProps = IxPublicPropTypes<typeof switchProps>
export interface SwitchBindings {
  focus: (options?: FocusOptions) => void
  blur: () => void
}
export type SwitchComponent = DefineComponent<
  Omit<HTMLAttributes, keyof SwitchPublicProps> & SwitchPublicProps,
  SwitchBindings
>
export type SwitchInstance = InstanceType<DefineComponent<SwitchProps, SwitchBindings>>
