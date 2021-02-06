<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="头像">
            </div>
            <!-- 表单区域 -->
            <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginFormRef">
                <!-- 账号 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item class="login_btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      // console.log(this)
      this.$refs.loginFormRef.resetFields();
    },
    login() {
        this.$refs.loginFormRef.validate(async (valid, obj) => {
            // console.log(valid);
            // console.log(obj);
            if(!valid) return; // 数据校验不通过，不发起请求
            // 发起登录请求
            const {data: res} = await this.$http.post('login', this.loginForm);
            if(res.meta.status !== 200) return this.$message.error("登录失败");
            // console.log("登录成功");
            // console.log(res);
            this.$message.success("登录成功");
            // 1. 登录成功之后，将token保存到客户端的sessionStorage中
            // 1.1 项目中其他接口必须在登录之后访问
            // 1.2 token只应在当前网站打开期间生效，所以token保存在sessionStorage
            sessionStorage.setItem("token", res.data.token);
            // 2. 通过编程式导航跳转到后台主页，路由地址 /home
            this.$router.push("/home");
        })
    }
  },
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b5b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
        width: 130px;
        height: 130px;
        border: 2px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

.login_btns {
    display: flex;
    justify-content: flex-end;
}
</style>
