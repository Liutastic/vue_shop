<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 提示区-->
            <el-alert
                    :closable="false"
                    title="添加商品信息"
                    type="info"
                    center
                    show-icon></el-alert>
            <!--步骤区域-->
            <el-steps :space="200" align-center :active="activeIndex - 0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- 添加商品表单-->
            <el-form label-position="top" :model="addForm" :rules="addFormRules" ref="addormRef"
                     label-width="100px">
                <!-- tab栏区域-->
                <el-tabs @tab-click="tabClicked" :before-leave="beforeTabLeave" :tab-position="'left'"
                         v-model="activeIndex">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input type="number" v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input type="number" v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input type="number" v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                    v-model="addForm.goods_cat"
                                    :options="cateList"
                                    :props="cateProps"
                                    @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item
                                :label="item.attr_name"
                                v-for="item in manyTableData"
                                :key="item.attr_id">
                            <!--复选框-->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals"
                                             :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!--action为图片要上传的api接口-->
                        <el-upload
                                :on-success="handleSuccess"
                                :headers="headerObj"
                                :action="uploadURL"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!--富文本编辑器-->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button @click="add" class="addBtn" type="primary">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img class="previewImage" :src="previewPath"/>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        data() {
            return {
                activeIndex: '0',
                cateList: [],
                //添加商品的表单数据对象
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_number: 0,
                    goods_weigh: 0,
                    goods_cat: [],
                    pics: [],
                    goods_introduce: '',
                    attrs: []

                },
                addFormRules: {
                    goods_name: [
                        {required: true, trigger: 'blur'}
                    ],
                    goods_price: [
                        {required: true, trigger: 'blur'}
                    ],
                    goods_number: [
                        {required: true, trigger: 'blur'}
                    ],
                    goods_weight: [
                        {required: true, trigger: 'blur'}
                    ],
                    goods_cat: [
                        {required: true, trigger: 'blur'}
                    ]
                },
                cateProps: {
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                //动态参数数据列表
                manyTableData: [],
                //静态参数数据列表
                onlyTableData: [],
                //上传图片的地址
                uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                //图片上传的请求头对象
                headerObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                previewPath: '',
                previewVisible: false,


            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            getCateList() {
                this.$http.get(`categories`)
                    .then(res => {
                        if (res.data.meta.status !== 200) return this.$message.error('获取商品列表失败')
                        this.cateList = res.data.data
                        this.$message.success('获取成功')
                    }).catch(err => err)
            },
            //级联选择器选中触发的函数
            handleChange() {
                if (this.addForm.goods_cat.length !== 3)
                    this.addForm.goods_cat = []
            },
            beforeTabLeave(activeName, oldActiveName) {
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) return false
            },
            tabClicked() {
                if (this.activeIndex === '1') {
                    this.$http.get(`categories/${this.cateId}/attributes`, {
                        params: {sel: 'many'}
                    }).then(res => {
                        // console.log(res);
                        if (res.data.meta.status !== 200) return this.$message.error('失败')
                        res.data.data.forEach(item => {
                            // console.log(item.attr_vals);
                            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                        })
                        this.manyTableData = res.data.data
                    }).catch(err => err)
                } else if (this.activeIndex === '2') {
                    this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'only'}})
                        .then(res => {
                            if (res.data.meta.status !== 200) return this.$message.error('获取商品参数失败')
                            this.onlyTableData = res.data.data
                        }).catch(err => err)
                }
            },
            //点击图片预览
            handlePreview(file) {
                this.previewPath = file.response.data.url
                this.previewVisible = true
            },
            //处理移除图片的操作
            handleRemove(file) {
                const filePath = file.response.data.tmp_path
                const i = this.addForm.pics.findIndex(x => {
                    x.pic === filePath
                })
                this.addForm.pics.splice(i, 1)
            },
            //图片上传成功事件
            /**
             * 1. 拼接图片信息
             * 2. 图片对象push到pics数组
             */
            handleSuccess(res) {
                // console.log(res);
                const picInfo = res.data.tmp_path
                this.addForm.pics.push(picInfo)

            },
            //填写完所有的商品信息之后的，添加商品按钮
            add() {
                this.$refs.addormRef.validate(valid => {
                    if (!valid) return this.$message.error('写完表单先啊 急什么啊')

                    //使用lodash对对象进行深拷贝，使用拷贝份转换字符串
                    const form = _.cloneDeep(this.addForm)
                    form.goods_cat = form.goods_cat.join(',')
                    //处理动态属性和静态参数
                    this.manyTableData.forEach(item => {
                        const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(' ')}
                        this.addForm.attrs.push(newInfo)
                    })
                    console.log(this.onlyTableData)
                    // this.onlyTableData.forEach(item => {
                    //     const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
                    //     this.addForm.attrs.push(newInfo)
                    // })
                    form.attrs = this.addForm.attrs

                    //提交添加商品请求
                    this.$http.post(`goods`, form).then(res => {
                        console.log(res);
                        if (res.data.meta.status !== 201) return this.$message.error('添加失败')
                        this.$message.success('添加商品成功')
                        this.$router.push(`/goods`)
                    }).catch(err => err)
                })
            }

        },
        computed: {
            cateId() {
                if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
                return null
            }
        }
    }
</script>

<style scoped lang="less">
  .previewImage {
    width: 100%;
  }

  .addBtn {
    margin-top: 20px;
  }
</style>
