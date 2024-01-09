<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%" size="mini">
          <!-- 下拉选项-->
          <el-option
            v-for="item in managerList"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" placeholder="1-100个字符" type="textarea" size="mini" :rows="4" style="width: 80%" />
      </el-form-item>
      <el-form-item>
        <!-- 按钮 -->
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="btnOk">确定</el-button>
            <el-button size="mini" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getDepartment, getManagerList, addDepartment, getDepartmentDetail, updateDepartment } from '@/api/department'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      // 技术部的技术部
      // JSBDJSB

      managerList: [],
      // 表单结构
      formData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: '' // 父级部门的id
      },

      rules: {
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1, max: 10, message: '部门编码的长度为2-10个字符', trigger: 'blur'
          },
          // 校验数据是否重复
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              // 输入的编码
              // 获取组织结构数据
              let res = await getDepartment()
              // 是否是编辑模式,编辑模式的时候需要排除id
              if (this.formData.id) {
                res = res.filter(item => item.id !== this.formData.id)
              }
              // result是否存在value
              if (res.some(item => item.code === value)) {
                // 有了相同的编码就跑错
                callback(new Error('the code is exists'))
              } else {
                callback()
              }
            }

          }
        ], // 部门编码
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, {
          min: 1, max: 100, message: '部门介绍的长度为1-100个字符', trigger: 'blur'
        }], // 部门介绍
        managerId: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }], // 部门负责人id
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 2, max: 10, message: '部门名称的长度为2-10个字符', trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              // 输入的编码
              // 获取组织结构数据
              let res = await getDepartment()
              // result是否存在value
              if (this.formData.id) {
                res = res.filter(item => item.id !== this.formData.id)
              }
              if (res.some(item => item.name === value)) {
                // 有了相同的编码就跑错
                callback(new Error('the code is exists'))
              } else {
                callback()
              }
            }

          }] // 部门名称
        // pid: '' // 父级部门的id 不需要做校验
      }

    }
  },
  // 计算属性
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getManagerList()
  },
  methods: {
    close() {
      // 子传父值，关闭弹曾
      this.$emit('update:showDialog', false)
      // 重置表单,有一个bug只能重置form的数据，不在form的数据 不能重置。需要手动赋值
      this.$refs.addDept.resetFields()
      this.formData = {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: '' // 父级部门的id
      }
    },
    async getManagerList() {
      const res = await getManagerList()
      this.managerList = res
    },
    btnOk() {
      // 传入整体校验
      this.$refs.addDept.validate(async isOk => {
        if (isOk) {
          // 新增和修改两个方法做区分
          if (this.formData.id) {
            await updateDepartment(this.formData)
          } else {
            // 延展运算符
            await addDepartment({ ... this.formData, pid: this.currentNodeId })
          }
          // 通知父组件更新
          this.$emit('updateDept')
          // 提示消息
          this.$message.success('success')
          this.close()
        }
      })
    },
    btnCancel() {
      this.close()
    },
    // 获取组织的详情
    async getDepartmentDetail() {
      this.formData = await getDepartmentDetail(this.currentNodeId)
    }
  }
}
</script>

<style>

</style>
