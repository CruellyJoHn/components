/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { BadgeComponent } from './src/types'

import Badge from './src/Badge.vue'

const IxBadge = Badge as unknown as BadgeComponent

export { IxBadge }

export type { BadgeInstance, BadgePublicProps as BadgeProps } from './src/types'
