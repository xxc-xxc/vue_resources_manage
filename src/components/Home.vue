<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单 -->
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router>
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="(item, index) in menulist" :key="index">
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="(subItem, index) in item.children" :key="index">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 主体内容 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 菜单数据
            menulist: [],
            iconsObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao',
            },
            isCollapse: false
        }
    },
    created() {
        this.getMenuList();
    },
    methods: {
        logout() {
            sessionStorage.clear(); // 清空token
            this.$router.push("/login"); // 跳转到登录页
        },
        async getMenuList() {
            const {data: res} = await this.$http.get('menus');
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.menulist = res.data;
            // console.log(res);
        },
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #FFFFFF;
    font-size: 24px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}

.el-main {
    background-color: #eaecf1;
}

.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #4A5064;
    font-size: 12px;
    line-height: 24px;
    color: #FFFFFF;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;
}
</style>