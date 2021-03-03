<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <!-- 修改按钮 -->
                        <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <!-- 删除按钮 -->
                        <el-button @click="removeUserById(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="30%"
            @close="addDialogClosed">
            <!-- 对话框主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑用户对话框 -->
        <el-dialog
            title="编辑用户"
            :visible.sync="editDialogVisible"
            width="30%">
            
            <el-form 
                :model="editForm" 
                :rules="editFormRules" 
                ref="editFormRef" 
                label-width="70px"
                @close="editDialogClosed">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="50%"
            @close="setRoleDialogClosed">
            <div>
                <p>当前用户：{{userInfo.username}}</p>
                <p>当前角色：{{userInfo.role_name}}</p>
                <p>分配角色：
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                            v-for="item in rolelist"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {

        // 验证邮箱规则
        let checkEmail = (rule, value, cb) => {
            const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

            if(regEmail.test(value)) {
                // 校验通过
                // cb为回调函数
                return cb();
            }

            // 校验不通过
            cb(new Error('请输入正确的邮箱'))
        }
        // 验证手机号规则
        let checkMobile = (rule, value, cb) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

            if(regMobile.test(value)) {
                // 校验通过
                // cb为回调函数
                return cb();
            }

            // 校验不通过
            cb(new Error('请输入正确的手机号'))
        }

        return {
            // 获取用户列表参数对象
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            userlist: [],
            total: 0, 
            // 控制添加用户对话框显示与隐藏
            addDialogVisible: false,
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            }, 
            addFormRules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 3, max: 10, message: '用户名长度在3-10个字符之间', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 6, max: 16, message: '密码长度在6-16个字符之间', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    {validator: checkEmail, trigger: 'blur'}
                ],
                mobile: [
                    {required: true, message: '请输入手机', trigger: 'blur'},
                    {validator: checkMobile, trigger: 'blur'}
                ]
            },
            // 控制编辑用户对话框的显示与隐藏
            editDialogVisible: false,
            // 接收查询到的用户数据对象
            editForm: {},
            // 编辑表单验证规则对象
            editFormRules: {
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    {validator: checkEmail, trigger: 'blur'}
                ],
                mobile: [
                    {required: true, message: '请输入手机', trigger: 'blur'},
                    {validator: checkMobile, trigger: 'blur'}
                ]
            },
            // 控制分配角色对话框的显示&隐藏
            setRoleDialogVisible: false,
            // 分配角色的用户对象
            userInfo: {},
            // 角色列表
            rolelist: [],
            // 已选中的角色id值
            selectedRoleId: ''
        }
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const {data: res} = await this.$http.get('users', {
                params: this.queryInfo
            });
            if(res.meta.status !== 200) {
                return this.$message.error('获取用户列表失败');
            }
            this.userlist = res.data.users;
            this.total = res.data.total;
            // console.log(res);
        },
        // 监听pagesize变化
        handleSizeChange(newSize) {
            // console.log(newSize);
            this.queryInfo.pagesize = newSize;
            this.getUserList();
        },
        // 监听页码变化
        handleCurrentChange(newPage) {
            // console.log(newPage);
            this.queryInfo.pagenum = newPage;
            this.getUserList();
        }, 
        async userStateChanged(userinfo) {
            // console.log(userinfo);
            const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
            if(res.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state;
                return this.$message.error('更新用户状态失败！');
            }          
            return this.$message.success('更新用户状态成功！');
        },
        // 监听添加用户对话框的关闭事件，重置表单
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        // 点击确定，添加新用户
        addUser() {
            // 表单预校验
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid);
                if(!valid) return; // 校验不通过
                // 校验通过，发起网络请求
                const {data: res} = await this.$http.post('users', this.addForm);
                if(res.meta.status !== 201) {
                    return this.$message.error('添加用户失败！');
                }
                this.$message.success('添加用户成功！');
                // 隐藏对话框
                this.addDialogVisible = false;
                this.getUserList();
            })
        },
        // 展示编辑用户对话框
        async showEditDialog(id) {
            // console.log(id);
            const {data: res} = await this.$http.get('users/' + id);
            if(res.meta.status !== 200) {
                // 获取数据失败
                return this.$message.error('查询用户数据失败！');
            }
            // console.log(res);
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 编辑表单重置
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        // 修改用户信息并提交
        editUserInfo() {
            // 表单预校验
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return

                // 校验通过
                const {data: res} = await this.$http.put('users/' + this.editForm.id, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                })

                if(res.meta.status !== 200) {
                    return this.$message.error('更新用户数据失败！');
                }
                this.$message.success('更新用户数据成功');
                this.editDialogVisible = false;
                this.getUserList();
            });
        },
        async removeUserById(id) {
            // console.log(id)
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error => error);

            // 如果用户确认删除，则返回值为字符串 confirm
            // 如果用户取消删除，则返回值为字符串 cancel
            // console.log(confirmResult);
            if(confirmResult !== 'confirm') {
                return this.$message.info('已取消删除');
            }
            // console.log('确认删除');
            const {data: res} = await this.$http.delete("users/" + id);
            if(res.meta.status !== 200) {
                this.$message.error('删除用户失败！');
            }
            this.$message.success('删除用户成功！');
            this.getUserList();
        },
        // 展示分配角色对话框
        async setRole(userInfo) {
            this.userInfo = userInfo;
            // 展示对话框之前，获取所有角色
            const {data: res} = await this.$http.get('roles');
            if(res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！')
            }
            this.rolelist = res.data;
            this.setRoleDialogVisible = true;
        },
        async saveRoleInfo() {

            if(!this.selectedRoleId) {
                return this.$message.error('请选择要分配的角色！');
            }

            // 分配角色请求
            const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {
                rid: this.selectedRoleId
            })

            if(res.meta.status !== 200) {
                return this.$message.error('更新角色失败！');
            }
            this.$message.success('更新角色成功！');
            this.getUserList();

            this.setRoleDialogVisible = false;
        },
        // 监听分配角色对话框关闭事件
        setRoleDialogClosed() {
            this.selectedRoleId = '';
            this.userInfo = {};
        }
    },
}
</script>

<style lang="less" scoped>

</style>