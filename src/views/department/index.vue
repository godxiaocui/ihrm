<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构-->
      <!-- 修改eltree的结构，改成插槽结构-->
      <el-tree :data="depts" :props="defaultProps" :default-expand-all="true">
        <!-- 修改eltree的结构，改成插槽结构-->
        <!-- 节点结构-->
        <!-- v-slot="{ node, data }" 只能作用在template，插槽作用的数据传入的{ node, data }   我们可以结构出我们要的 data-->
        <template v-slot="{ data }">
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">
                {{ data.managerName }}
              </span>
              <!-- $event 实参 表示类型 -->
              <el-dropdown>
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown></el-col>
          </el-row>
        </template></el-tree>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Department',
  data() {
    return {
      //  树的 数据属性
      depts: [{
        name: '传智教育',
        managerName: '管理员',
        children: [
          { name: '总裁办', managerName: '章三' },
          { name: '行政部', managerName: '里斯' },
          { name: '财务部', managerName: '王五' }
        ]
      }],
      defaultProps: {
        label: 'name', // 显示字段的名字
        children: 'children'
      }
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}
.tree-manager {
  width: 50px;
  display: inline-block;
  margin: 10px;
}
</style>
