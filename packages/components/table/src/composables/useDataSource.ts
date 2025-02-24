/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { Key, TablePagination, TableProps } from '../types'
import type { GetRowKey } from './useGetRowKey'
import type { ActiveSortable } from './useSortable'
import type { ComputedRef, Ref } from 'vue'

import { computed } from 'vue'

export function useDataSource(
  props: TableProps,
  getRowKey: ComputedRef<GetRowKey>,
  activeSortable: ActiveSortable,
  expandedRowKeys: Ref<Key[]>,
  mergedPagination: ComputedRef<TablePagination | null>,
): DataSourceContext {
  const mergedData = computed(() => {
    const { dataSource, childrenKey } = props
    const getKey = getRowKey.value
    return dataSource.map(record => covertMergeData(record, getKey, childrenKey))
  })

  const mergedMap = computed(() => {
    const map = new Map<Key, MergedData>()
    covertDataMap(mergedData.value, map)
    return map
  })
  // TODO
  const filteredData = computed(() => mergedData.value)
  const sortedData = computed(() => {
    const { sorter, orderBy } = activeSortable
    if (sorter && orderBy) {
      const oderFlag = orderBy === 'ascend' ? 1 : -1
      const tempData = filteredData.value.slice()
      return tempData.sort((curr, next) => oderFlag * sorter(curr.record, next.record))
    } else {
      return filteredData.value
    }
  })
  const paginatedData = computed(() => {
    const pagination = mergedPagination.value
    const data = sortedData.value
    if (pagination === null || pagination.total) {
      return data
    } else {
      const { total } = pagination
      if (total && data.length < total) {
        return data
      }
      const pageSize = pagination.pageSize!
      const startIndex = (pagination.pageIndex! - 1) * pageSize
      return data.slice(startIndex, startIndex + pageSize)
    }
  })
  const paginatedMap = computed(() => {
    const map = new Map<Key, MergedData>()
    covertDataMap(paginatedData.value, map)
    return map
  })

  const flattedData = computed(() => {
    const expandedKeys = expandedRowKeys.value
    if (expandedKeys.length > 0) {
      const data: FlattedData[] = []
      paginatedData.value.forEach(item => data.push(...flatData(item, 0, expandedKeys)))
      return data
    }
    return paginatedData.value.map(item => ({ ...item, expanded: false, level: 0 }))
  })

  return { filteredData, flattedData, mergedMap, paginatedMap }
}

export interface DataSourceContext {
  filteredData: ComputedRef<MergedData[]>
  flattedData: ComputedRef<FlattedData[]>
  mergedMap: ComputedRef<Map<Key, MergedData>>
  paginatedMap: ComputedRef<Map<Key, MergedData>>
}

export interface MergedData {
  children?: MergedData[]
  parentKey?: Key
  record: unknown
  rowKey: Key
}

export interface FlattedData extends MergedData {
  expanded: boolean
  level: number
}

function covertMergeData(record: unknown, getRowKey: GetRowKey, childrenKey: string, parentKey?: Key) {
  const rowKey = getRowKey(record)
  const result: MergedData = { record, rowKey, parentKey }

  const subData = (record as Record<string, unknown>)[childrenKey] as unknown[]
  if (subData) {
    result.children = subData.map(subRecord => covertMergeData(subRecord, getRowKey, childrenKey, rowKey))
  }
  return result
}

function covertDataMap(mergedData: MergedData[], map: Map<Key, MergedData>) {
  mergedData.forEach(item => {
    const { rowKey, children } = item
    map.set(rowKey, item)
    if (children) {
      covertDataMap(children, map)
    }
  })
}

// TODO: performance optimization
// when virtual scrolling is enabled, this do not need to traverse all nodes
function flatData(data: MergedData, level: number, expandedRowKeys: Key[]) {
  const { children, parentKey, record, rowKey } = data
  const expanded = expandedRowKeys.includes(rowKey)
  const result: FlattedData[] = [{ children, parentKey, record, rowKey, level, expanded }]

  if (expanded && children) {
    children.forEach(subRecord => result.push(...flatData(subRecord, level + 1, expandedRowKeys)))
  }

  return result
}
