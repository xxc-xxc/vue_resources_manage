<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader
                        :options="catelist"
                        :props="cascaderProps"
                        v-model="selectedCateKeys"
                        @change="parentCateChanged">
                    </el-cascader>
                </el-col>
            </el-row>

            <!-- tab标签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数按钮 -->
                    <el-button @click="addDialogVisible=true" :disabled="isBtnDisabled" type="primary" size="mini">添加参数</el-button>

                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag @close="handleClose(index, scope.row)" closable v-for="(item, index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                                <el-input
                                this.save
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性按钮 -->
                    <el-button @click="addDialogVisible=true" :disabled="isBtnDisabled" type="primary" size="mini">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag @close="handleClose(index, scope.row)" closable v-for="(item, index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                                <el-input
                                this.save
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数对话框 -->
        <el-dialog
            :title="'添加' + titleText"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
            <el-form 
                :model="addForm" 
                :rules="addFormRules" 
                ref="addFormRef" 
                label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数对话框 -->
        <el-dialog
            :title="'修改' + titleText"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed">
            <el-form 
                :model="editForm" 
                :rules="editFormRules" 
                ref="editFormRef" 
                label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            catelist: [],
            cascaderProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择框双向绑定到的数组
            selectedCateKeys: [],
            // 双向绑定选中项的name
            activeName: 'many',
            // 动态参数的数据
            manyTableData: [],
            // 静态属性的数据
            onlyTableData: [],
            // 控制添加对话框的显示与隐藏
            addDialogVisible: false,
            // 添加参数的表单数据对象
            addForm: {
                attr_name: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                attr_name: [
                    {required: true, message: '请输入参数名称', trigger: 'blur'}
                ]
            },
            // 控制修改对话框的显示与隐藏
            editDialogVisible: false,
            // 修改表单数据对象
            editForm: {},
            // 修改表单校验规则
            editFormRules: {
                attr_name: [
                    {required: true, message: '请输入参数名称', trigger: 'blur'}
                ]
            },
        }
    },
    created() {
        this.getCateList();
    },
    methods: {
        // 获取所有商品分类信息
        async getCateList() {
            const {data: res} = await this.$http.get('categories');

            if(res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败！')
            }
            this.catelist = res.data;
            // console.log(this.catelist);
        },
        parentCateChanged() {
            this.getParamsData();
        },
        // tab标签点击事件处理函数
        handleTabClick() {
            // console.log(this.activeName);
            this.getParamsData();
        },
        // 获取参数列表数据
        async getParamsData() {
            // 只允许选择三级分类
            if(this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = [];
                this.manyTableData = [];
                this.onlyTableData = [];
                return;
            }

            // console.log(this.selectedCateKeys);
            // 根据所选三级分类id和当前所处面板，获取对应参数数据
            const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                params: {sel: this.activeName}
            })

            if(res.meta.status !== 200) {
                return this.$message.error('获取参数列表失败！');
            }

            // console.log(res.data)
            // 将attr_vals分割为字符串数组
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                item.inputVisible = false;
                item.inputValue = '';
            })
            // console.log(res.data);
            // 根据不同的面板，将获取的数据挂载到不同对象上
            if(this.activeName === 'many') {
                this.manyTableData = res.data;
            } else {
                this.onlyTableData = res.data;
            }
        },
        // 监听添加对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        // 发起请求添加参数
        addParams() {
            // 表单预校验
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })

                // 失败
                if(res.meta.status !== 201) {
                    return this.$message.error('添加参数失败');
                }

                // 成功
                this.$message.success('添加参数成功');
                // 关闭对话框
                this.addDialogVisible = false;
                // 重新获取数据
                this.getParamsData();
            })
        },
        // 展示修改对话框
        async showEditDialog(attr_id) {
            // 查询当前参数的信息
            const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`)

            if(res.meta.status !== 200) {
                return this.$message.error('获取参数信息失败！');
            }

            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 关闭对话框重置表单
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        // 修改参数信息
        editParams() {
            // 表单预校验
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return
                const {data: res} = await this.$http.put(
                    `categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                        attr_name: this.editForm.attr_name, attr_sel: this.activeName
                    }
                )

                if(res.meta.status !== 200) {
                    return this.$message.error('修改参数失败！');
                }
                this.$message.success('修改参数成功！');
                this.getParamsData();
                this.editDialogVisible = false;
            })
        },
        // 根据id删除对象的参数项
        async removeParams(attr_id) {
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);

            if(confirmResult !== 'confirm') {
                return this.$message.info('取消删除！');
            }

            // 发起删除请求
            const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
            if(res.meta.status !== 200) {
                return this.$message.error('删除参数失败！');
            }
            this.$message.success('删除参数成功！');
            this.getParamsData();
        },
        // 文本框失去焦点或按下enter时触发
        async handleInputConfirm(row) {
            if(row.inputValue.trim().length === 0) {
                row.inputValue = '';
                row.inputVisible = false;
                return;
            }

            // 输入了有效的内容，提交到后台
            row.attr_vals.push(row.inputValue.trim());
            row.inputValue = '';
            row.inputVisible = false;
            // 发起请求 保存到数据库
            this.saveAttrVals(row);
        },
        async saveAttrVals(row) {
            // 发起请求 保存到数据库
            const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' ')
            })

            if(res.meta.status !== 200) {
                return this.$message.error('修改参数项失败');
            }
            this.$message.success('修改参数项成功');
        },
        // 显示文本输入框
        showInput(row) {
            row.inputVisible = true;

            // 文本框自动获取焦点
            // nextTick：页面被重新渲染之后，才会执行回调函数中的代码。
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        }, 
        // 删除对应的参数的可选项
        handleClose(index, row) {
            row.attr_vals.splice(index, 1);
            this.saveAttrVals(row);
        }

    },
    computed: {
        // 计算属性，控制按钮是否可以点击
        isBtnDisabled() {
            if(this.selectedCateKeys.length !== 3) {
                return true;
            }

            return false;
        },
        // 当前选中的三级分类的id
        cateId() {
            if(this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[2];
            }
            return null;
        },
        // 动态参数与静态属性共用一个对话框
        titleText() {
            if(this.activeName === 'many') {
                return '动态参数';
            }

            return '静态属性';
        }
    }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
.el-tag {
    margin: 0 10px;
}
.el-input {
    width: 120px
}
</style>