<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构-->
      <!-- 修改eltree的结构，改成插槽结构-->
      <el-tree :data="depts" :props="defaultProps" :default-expand-all="false">
        <!-- 修改eltree的结构，改成插槽结构-->
        <!-- 节点结构-->
        <!-- v-slot="{ node, data }" 只能作用在template，插槽作用的数据传入的{ node, data }   我们可以结构出我们要的 data-->
        <template v-slot="{ data }">
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="12">
              <span class="tree-manager">
                {{ data.managerName }}
              </span>
              <!-- $event 实参 表示类型 -->
              <!-- command下拉框方法触发的点击事件-->
              <el-dropdown @command="operarteDept">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <!-- command项-->
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown></el-col>
          </el-row>
        </template></el-tree>
    </div>
    <!--引入编辑弹曾 -->
    <!-- 正常来讲你接受不了子传父的数据，要写一个专门的方法的接受， 但是.sync 等于实现了一个update:showDialog的值=》 属性-->
    <add-dept :show-dialog.sync="showDialog" />
  </div>
</template>
<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  name: 'Department',
  components: {
    AddDept
  },
  data() {
    return {
      showDialog: false, // 控制弹曾是否显示
      //  树的 数据属性
      depts: [],
      defaultProps: {
        label: 'name', // 显示字段的名字
        children: 'children'
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      //  promise 都要有await方法
      const res = await getDepartment()
      console.log(res)
      this.depts = transListToTreeData(res, 0)
      console.log(this.depts)
    },
    operarteDept(type) {
      // 传入的command的项
      if (type === 'add') {
        this.showDialog = true
      }
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 50px 140px;
  font-size: 14px;
}
.tree-manager {
  width: 80px;
  display: inline-block;
  margin: 20px;
}
</style>
