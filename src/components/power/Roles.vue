<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="rolelist" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级&三级权限 -->
                            <el-col :span="19">
                                <!-- 渲染二级权限 -->
                                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag closable @close="removeRightById(scope.row, item2.id)" type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>

                                    <el-col :span="18">
                                        <el-tag closable @close="removeRightById(scope.row, item3.id)" type="warning" v-for="(item3, i3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre>{{scope.row}}</pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 所有角色列表数据
            rolelist: [],
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible: false,
            // 保存权限数据
            rightslist: []
        }
    },
    created() {
        this.getRoleList();
    },
    methods: {
        async getRoleList() {
            const {data: res} = await this.$http.get('roles');
            if(res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！');
            }

            this.rolelist = res.data;
            // console.log(res.data);
        },
        async removeRightById(role, rightId) {
            const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);

            if(confirmResult !== 'confirm') {
                return this.$message.info('取消删除');
            }
            // console.log('确认删除');
            // 发起删除权限请求
            const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);

            // 删除权限失败
            if(res.meta.status !== 200) {
                return this.$message.error('删除权限失败！');
            }
            // this.getRoleList(); // 会刷新页面，体验不好
            role.children = res.data; // 直接将删除后的结果赋值给children，不会刷新页面
        },
        // 展示分配权限对话框
        async showSetRightDialog() {
            // 获取所有权限数据
            const {data: res} = await this.$http.get('rights/tree');

            // 获取数据失败
            if(res.meta.status !== 200) {
                return this.$message.error('获取权限数据失败！');
            }

            // 把获取到的权限数据保存到data中
            this.rightslist = res.data;
            console.log(this.rightslist);

            this.setRightDialogVisible = true;
        }
    },
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 10px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

// 垂直居中
.vcenter {
    display: flex;
    align-items: center;
}
</style>