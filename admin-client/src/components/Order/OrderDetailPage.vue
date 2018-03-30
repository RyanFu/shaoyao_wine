<template>
    <div class="content-page">
        <div class="content-nav">
            <div class="breadcrumb">
                订单详情
            </div>
            <div class="operation-nav">
                <el-button type="primary" @click="goBackPage" size="small" icon="arrow-left">返回列表</el-button>
            </div>
        </div>
        <div class="content-main">
            <div class="form-table-box" v-loading="pageLoading" element-loading-text="拼命加载中">

               <el-form ref="infoForm" :model="infoForm" label-width="120px">
                  <el-form-item label="状态">
                    <p>{{infoForm.order_status_text}}</p>
                  </el-form-item>
                  <el-form-item label="操作">
                    <div v-if="infoForm.order_status === 0">
                      
                    </div>
                    <div v-else-if="infoForm.order_status === 201">
                      <el-select v-model="orderExpress.exp" placeholder="请选择快递">
                        <el-option
                          v-for="item in orderExpress.lists"
                          :key="item.value"
                          :label="item.label"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="orderExpress.num" placeholder="请输入快递号"></el-input>

                      <el-button size="small"  type="danger" @click="delivery">发货</el-button>
                    </div>
                  </el-form-item>
                  

                  <el-form-item label="下单时间">
                    <p>{{infoForm.add_time}}</p>
                  </el-form-item>
                  <el-form-item label="订单编号">
                    <p>{{infoForm.order_sn}}</p>
                  </el-form-item>
                  <el-form-item label="实付">
                    <p>￥{{infoForm.actual_price}}</p>
                  </el-form-item>

                  <el-form-item label="收货人">
                    <p>{{infoForm.consignee}}</p>
                  </el-form-item>
                  <el-form-item label="电话">
                    <p>{{infoForm.mobile}}</p>
                  </el-form-item>
                  <el-form-item label="收货地址">
                    <p>{{infoForm.full_region}}</p>
                  </el-form-item>
                </el-form>

                <div class="goods">
                    <p>商品信息</p>
                    <el-form label-width="120px" v-for="(item,index) in orderGoods" :key="index">
                      <el-form-item label="图片">
                        <img :src="item.list_pic_url" width="100">
                      </el-form-item>
                      <el-form-item label="商品名称">
                        <p>{{item.goods_name}}</p>
                      </el-form-item>
                      <el-form-item label="价格">
                        <p>￥{{item.retail_price}}</p>
                      </el-form-item>
                    </el-form>
                </div>
                <div>
                    
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pageLoading: false,
                infoForm: {
                    id: 0,
                },
                orderGoods:[],
                orderExpress:{
                    lists:[
                        {
                          value: 'sf',
                          label: '顺丰'
                        }
                    ],
                    exp:{},
                    num:''
                }
            }
        },
        methods: {
            goBackPage() {
                this.$router.go(-1);
            },
            getInfo() {
                if (this.infoForm.id <= 0) {
                    return false
                }

                //加载品牌详情
                let that = this
                this.axios.get('order/info', {
                    params: {
                        id: that.infoForm.id
                    }
                }).then((response) => {
                    let resInfo = response.data.data;
                    that.infoForm = resInfo.orderInfo;
                    that.orderGoods = resInfo.orderGoods;
                    this.pageLoading = false;
                })
            },
            delivery(){
                let that =this;
                this.$confirm('确定要发货?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {

                  this.axios.post('order/delivery', {
                      id:that.infoForm.id, 
                      num: that.orderExpress.num,
                      shipper_name: that.orderExpress.exp.label, 
                      shipper_code:that.orderExpress.exp.value 
                    }).then((response) => {
                    console.log(response.data)
                     
                  })


                });
            }

        },
        components: {},
        mounted() {
            console.log(this.$route.query)
            this.infoForm.id = this.$route.query.id || 0;
            this.getInfo();
        }
    }

</script>

<style>
   
</style>
