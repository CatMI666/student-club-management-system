<style lang="stylus" scoped>
.container
    height 100%
    width 100%
    background-image url('../../images/LoginBackground.jpg')
.login-box
    position fixed
    top calc(50% - 200px)
    left calc(50% - 175px)
    width 350px
    height 340px

    background-color rgba(255, 255, 255, 0.9)
    border 3px solid #888
    border-radius 10px
    padding 16px
    .title
        font-size 35px
        font-weight bolder
        margin 10px 0px 40px 0px
.el-form-item
    margin 20px 10px 20px 0px
.el-button
    width 80%
    margin 10px
</style>

<template lang="pug">
.container 
    .login-box(v-loading="logining" :element-loading-text="loginMsg")
        .title 社团管理系统
        el-form(ref="loginForm" :model="loginData" :rules="formRules" label-width="5px")
            el-form-item(label="" prop="username")
                el-input(v-model="loginData.username" placeholder="在此处输入用户名")
            el-form-item(label="" prop="password")
                el-input(v-model="loginData.password" placeholder="在此处输入密码" type="password")
            el-button(type="primary" @click="onSubmit('loginForm')") 登入系统
            el-button(@click="signVisable = !signVisable") 注册用户
    el-dialog(title="注册" :visible.sync="signVisable")
        sign(@submit-sign="signVisable = false")
</template>

<script>
import { checkSession } from '../../session.js'
import Sign from './Sign'
export default {
    name: 'Login',
    data: () => ({
        loginData: {
            username: '',
            password: ''
        },
        formRules: {
            username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
            password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        },
        signVisable: false,
        logining: false,
        loginMsg: '登录中，请稍候...'
    }),
    components: { Sign },
    methods: {
        onSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.logining = true
                    this.loginMsg = '登录中，请稍候...'
                    this.$post('/v1/user/login', this.loginData).then(resp => {
                        if (resp.data.state) {
                            this.session.token = resp.data.token
                            this.loginMsg = '验证完成，正在加载本地缓存'

                            document.cookie = 'token=0;expires=' + new Date(0).toUTCString()
                            document.cookie = `token=${resp.data.token}`

                            this.loginMsg = '加载完成，正在获取用户权限...'
                            checkSession().then(() => {
                                this.loginMsg = '加载完成，正在进入系统'
                                this.logining = false

                                this.$router.push('/main/UserCenter')
                            })
                        }
                        else {
                            this.$message.error('登陆失败！用户名或密码错误')
                            this.logining = false
                        }
                    })
                }
                else {
                    this.$message.warning('请正确填写信息')
                }
            })
            
        },
        onRegist() {
            console.log('跳转至注册页面')
        }
    }
}
</script>
