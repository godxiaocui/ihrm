<template>
  <!-- elmeny ui 级联组件-->
  <!-- 样式可以通用 -->
  <!-- 建明是可以修改的，要对应props的字段-->
  <!-- 级联组建中:value用来接收数据-->
  <!-- 级联组建中@change用来接收数据绑定数据更新-->
  <el-cascader size="mini" :options="treeData" :props="props" separator="-" :value="value" @change="changeValue" />
</template>

<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  // 这里要做一个v-model的双向绑定
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      treeData: [], // 赋值给级联选择器
      props: {
        label: 'name', // 展示的字段
        value: 'id' //  存储的字段
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const res = await getDepartment()
      this.treeData = transListToTreeData(res, 0)
    },
    changeValue(data) {
      // 级联传入的是一个数组，我们要需要具体部门id要数组的最后一位
      if (data.length > 0) {
        this.$emit('input', data[data.length - 1])
      } else {
        this.$emit('input', null)
      }
    }
  }
}
</script>

<style>

</style>
