<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table 
                :data="catelist" 
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                show-index
                index-text="#"
                border
                class="tree-table">

                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" style="color: red" v-else></i>
                </template>

                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>

                <!-- 操作 -->
                <template slot="operator" slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>

            </tree-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%">
            <el-form 
                :model="addCateForm" 
                :rules="addCateFormRules" 
                ref="addCateFormRef" 
                label-width="100px">
                <el-form-item label="分类名称:" prop="cate_name">
                    <el-input v-model="addCateForm.cate_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类列表
            catelist: [],
            // 数据总数
            total: 0,
            // table指定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前列使用模板名称
                    template: 'isok'
                },
                {
                    label: '排序',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前列使用模板名称
                    template: 'order'
                },
                {
                    label: '操作',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前列使用模板名称
                    template: 'operator'
                }
            ],
            // 控制添加分类对话框是否可见
            addCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                // 分类名称
                cat_name: '',
                // 父级分类id
                cat_pid: 0,
                // 分类的等级，默认添加一级分类
                cat_level: 0
            },
            // 添加分类表单验证规则对象
            addCateFormRules: {
                cate_name: [
                    {required: true, message: '请输入分类名称', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.getCateList();
    },
    methods: {
        async getCateList() {
            const {data: res} = await this.$http.get('categories', {params: this.queryInfo})

            if(res.meta.status !== 200) {
                return this.$message.error("获取商品分类失败！");
            }
            // console.log(res.data);
            this.catelist = res.data.result;
            // console.log(this.catelist);
            this.total = res.data.total;
            // console.log(this.total);
        },
        // 监听pagesize改变
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },
        // 监听pagenum改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        // 显示添加分类对话框
        showAddCateDialog() {
            this.addCateDialogVisible = true;
        }
    },
}
</script>

<style lang="less" scoped>
.tree-table {
    margin-top: 15px;
}
</style>