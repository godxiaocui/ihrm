<template>
  <div class="container">
    <div class="app-container">
      <el-button size="mini" type="primary" class="btn-add" @click="addPermission(0, 1)"> 添加权限</el-button>
      <!-- 表格展示树形需要一个rowkey -->
      <el-table :data="list" row-key="id" default-expand-all>
        <el-table-column label="名称" prop="name"><!-- 内容--></el-table-column>
        <el-table-column label="标识" prop="code"><!-- 内容--></el-table-column>
        <el-table-column label="描述" prop="description"><!-- 内容--></el-table-column>
        <el-table-column label="操作"><!-- 内容-->
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" size="mini" @click="addPermission(row.id, 1)">添加</el-button>
            <el-button type="text" size="mini" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" size="mini" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加员工弹曾-->
    <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList, addPermission, updatePermission, delPermission, getPermissionDetail } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: 0// 默认关闭
      }, rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false

    }
  },
  // 观察计算属性
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), 0)
    },
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async editPermission(id) {
      // 根据获取id获取详情
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    // 删除操作
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnOK() {
      this.$refs.perForm.validate(async(isOK) => {
        if (isOK) {
          if (this.formData.id) {
            await updatePermission(this.formData)
            this.getPermissionList()
            this.showDialog = false
          } else {
            await addPermission(this.formData)
            //  提示消息
            this.$message.success('新增成功')
            this.getPermissionList()
            this.showDialog = false
          }
        }
      })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: 0 // 默认关闭
      }
      this.$refs.perForm.resetFields() // 重制表格数据
      this.showDialog = false
    }
  }
}
</script>
<style scoped>
.btn-add{
  margin: 10px;
}
</style>
