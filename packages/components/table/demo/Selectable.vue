<template>
  <IxSpace>
    <IxSwitch v-model:checked="selectableColumn.multiple" checkedChildren="Checkbox" unCheckedChildren="Radio">
    </IxSwitch>
    <IxRadioGroup v-model:value="selectableColumn.trigger">
      <IxRadio value="click">Click</IxRadio>
      <IxRadio value="dblclick">DblClick</IxRadio>
    </IxRadioGroup>
  </IxSpace>
  <br />
  <IxTable v-model:selectedRowKeys="selectedRowKeys" :columns="columns" :dataSource="data" :pagination="null">
    <template #name="{ value }">
      <a>{{ value }}</a>
    </template>
  </IxTable>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

import { TableColumn } from '@idux/components/table'

import { TableColumnSelectable } from '../src/types'

interface Data {
  key: number
  name: string
  age: number
  address: string
}

const selectedRowKeys = ref([1])

const selectableColumn = reactive<TableColumnSelectable<Data>>({
  type: 'selectable',
  disabled: record => record.key === 4,
  multiple: true,
  onChange: (selectedKeys, selectedRows) => console.log(selectedKeys, selectedRows),
})

const columns: TableColumn<Data>[] = [
  selectableColumn,
  {
    title: 'Name',
    dataKey: 'name',
    customRender: 'name',
  },
  {
    title: 'Age',
    dataKey: 'age',
  },
  {
    title: 'Address',
    dataKey: 'address',
  },
]

const data: Data[] = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: 3,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: 4,
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
]
</script>
