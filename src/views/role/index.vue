<template>
  <div class="container">
    <div class="app-container">
      <div class="role-operate">
        <el-button type="primary" size="mini" @click="showDialog=true"> 添加角色</el-button>
      </div>
      <!-- 放置table组件-->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200" label="角色">
          <!-- 利用插槽做一个配置-->
          <template v-slot="{ row }">
            <!-- 条件判断-->
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else> {{ row.name }}</span>
          </template>
        </el-table-column>
        <!-- 启用0/1 设置为已启用未启用 -->
        <el-table-column prop="state" align="center" width="200" label="启用">
          <!-- 传入一个插槽内容 ，自定义列结构-->
          <!-- 作用域插槽 ，v-slot 直接解构 或者用官方的模板-->
          <!-- 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据-->
          <template v-slot="{ row }">
            <!-- 设置开关的值，开是1 ，关是0-->
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <span v-else>{{ row.state===1? "已启用" : row.state === 0 ? "未启用" : "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <!-- 利用插槽做一个配置-->
          <template v-slot="{ row }">
            <!-- 条件判断-->
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="mini" type="textarea" />
            <span v-else> {{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <!-- 放置操作按钮 -->
          <template v-slot="{ row }">
            <!-- 非编辑状态-->
            <template v-if="row.isEdit">
              <el-button type="primary" size="mini" @click="btnEditOK(row)">确定</el-button>
              <el-button type="danger" size="mini" @click="btnEditCancel(row)">取消</el-button>
            </template>
            <!-- 编辑状态-->
            <template v-else>
              <el-button size="mini" type="text">分配权限</el-button>
              <el-button size="mini" type="text" @click="btnEditRow(row)">编辑</el-button>
              <el-button size="mini" type="text">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <!-- 当需要对齐的时候推荐用el-row-->
      <!--type="flex" justify="end" 保证末端对齐  -->
      <!--style="height:60px" align="middle" 垂直对齐 和设置高度 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件 -->
        <!-- 左箭头，数字，右箭头 -->
        <el-pagination
          :page-size="pageParams.pageSize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置弹层 弹层的关闭不要忘记调用关闭的方法-->
    <el-dialog width="500px" title="新增角色" :visible.sync="showDialog" @close="btnCancel">
      <!-- 表单内容 -->
      <el-form ref="roleForm" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" style="width:300px" size="mini" />
        </el-form-item>
        <el-form-item label="启用" prop="sate">
          <!-- 需要给switch 设置一个开的值和一个关的值 :active-value="1" :inactive-value="0"-->
          <el-switch v-model="roleForm.sate" size="mini" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width:300px" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOk">确定</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      showDialog: false,
      // 将分页信息放置到一个对象中
      pageParams: {
        page: 1, // 当前信息,第几页
        pageSize: 10, // 当前信息，每页总数
        total: 0 // 总数
      },
      roleForm: {
        name: '',
        description: '',
        state: 0 // 默认未1启用 关闭 0 打开1
      },
      rules: {
        name: [{ required: true, message: '名字需要填写', trigger: 'blur' }],
        description: [{ required: true, message: '文字需要填写', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.list = rows // 赋值数据
      this.pageParams.total = total
      // 给数据添加一个isEdit的标记
      this.list.forEach(item => {
        // item.isEdit = false // 数据响应
        // 添加的动态属性不具备响应式的特点
        // 添加动态属性 添加到响应式 this.$set(目标对象，属性名称，默认值)
        this.$set(item, 'isEdit', false)
        // 设置缓存的数据
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    // 会传入的数据是当前页码
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getRoleList()
    },
    btnOk() {
      // 表单校验
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.roleForm = {}
      this.showDialog = false
    },
    btnEditRow(row) {
      row.isEdit = true // 修改行的数据状态
      // 更新缓存数据
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    btnEditOK(row) {

    },
    btnEditCancel(row) {

    }
  }
}
</script>
<!-- scoped 本组件生效-->
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
