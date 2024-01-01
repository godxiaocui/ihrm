<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <!-- el-form el form item-->
        <el-form ref="form" :model="loginForm" :rules="loginRules">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入手密码" show-password />
          </el-form-item>
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginForm.isAgree">
              用户平台保存协议
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:350px" @click="login"> 登录</el-button>
          </el-form-item>
          <el-button @click="testAjax">测试按钮1</el-button>
          <el-button @click="testRequest">测试按钮2</el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import request from '@/utils/request'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '',
        password: process.env.NODE_ENV === 'development' ? 'hm#qd@23!' : ' ',
        isAgree: process.env.NODE_ENV === 'development'
      },
      // 规则
      loginRules: {
        mobile: [
          // 第一规则
          { required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          // 第二规则
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        password: [
          // 第一规则
          { required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          // 密码长度
          {
            min: 6,
            max: 16,
            message: '密码长度6-17'

          }
        ],
        // required只能检查null undifined ""
        isAgree:
        [{
          validator: (rule, value, callback) => {
            // rule校验规则
            // value校验的值
            // callback 函数
            value ? callback() : callback(new Error('您必须勾选用户协议'))
          }
        }]
      }
    }
  },
  methods: {
    login() {
      this.$refs.form.validate(async(isOk) => {
        if (isOk) {
          alert('校验通过')
          // 调用登录方法 , 写await方法，注意async的位置，代表要等他返回成功
          await this.$store.dispatch('user/login', this.loginForm)
          this.$router.push('/')
        }
      })
    },
    testAjax() {
      axios({
        //  url: 'https://heimahr.itheima.net/api/sys/login',
        url: '/api/sys/login', // 为生效代理这里需要去掉前缀//原理 'http://localhost:9528/api/sys/login'=> url: 'https://heimahr.itheima.net/api/sys/login',
        method: 'post',
        data: {
          mobile: '13912345678',
          password: '123456'
        }

      })
    },
    testRequest() {
      request({
        url: '/sys/login',
        method: 'post',
        data: {
          mobile: '13912312312',
          password: '123456'
        }
      })
    }
  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color:#606266;
    }
  }
}
</style>
