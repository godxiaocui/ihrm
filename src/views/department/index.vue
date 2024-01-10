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
              <!-- $event 实参，理解成不用传数据，就是可以表示的类型，这里是type  -->
              <el-dropdown @command="operarteDept($event,data.id)">
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
    <!-- 这里监听了子组件的传值，如果子组件更新成功，重新拉取数据-->
    <!-- ref可以获取实例对象，也可以获取自定义组件的实例对象-->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :current-node-id="currentNodeId" @updateDept="getDepartment" />
  </div>
</template>
<script>
import { getDepartment, delDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  name: 'Department',
  components: {
    AddDept
  },
  data() {
    return {
      currentNodeId: null, // 父组件id
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
      this.depts = transListToTreeData(res, 0)
    },
    // 这里的type是实参，同时还可以传入一个形参
    operarteDept(type, id) {
      // 传入的command的项
      if (type === 'add') {
        this.showDialog = true
        this.currentNodeId = id
      } else if (type === 'edit') {
        // 编辑部门
        this.showDialog = true
        // 将部门信息带到后续的页面中
        this.currentNodeId = id
        // 更新props currentNodeId 是异步的操作
        // 调用子组件是同步的操作
        // 要在子组件获取数据
        // 父组件调用子组件的方法获取数据
        // // this.$refs.addDept 等同于子组件的this
        // 需要等到数据更新完毕在执行回调函数 this.$nextTick()
        this.$nextTick(() => {
          this.$refs.addDept.getDepartmentDetail() //  this.$refs.addDept. 这个前缀可以直接获取到子组件的方法
        })
      } else {
        // 删除部门
        // 删除部门
        this.$confirm('您确认要删除该部门吗').then(async() => {
          await delDepartment(id)
          // 提示消息
          this.$message.success('删除部门成功')
          this.getDepartment()
        })
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
