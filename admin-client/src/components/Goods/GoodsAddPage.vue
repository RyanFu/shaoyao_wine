<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{infoForm.id ? '编辑商品' : '添加商品'}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
      </div>
    </div>
    <div class="content-main">
      <div class="form-table-box">
        <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
          <el-form-item label="所属分类">
            <el-select v-model="infoForm.category_id" multiple placeholder="请选择分类"  value="">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="infoForm.name"></el-input>
          </el-form-item>

          <el-form-item label="商品简介" prop="goods_brief">
            <el-input type="textarea" v-model="infoForm.goods_brief" :rows="3"></el-input>
            <div class="form-tip"></div>
          </el-form-item>
          <el-form-item label="原价(专柜价格)" prop="counter_price">
            <el-input v-model="infoForm.counter_price"></el-input>
            <div class="form-tip"></div>
          </el-form-item>
          <el-form-item label="售价" prop="retail_price">
            <el-input v-model="infoForm.retail_price"></el-input>
            <div class="form-tip"></div>
          </el-form-item>
          <el-form-item label="库存" prop="goods_number">
            <el-input v-model="infoForm.goods_number"></el-input>
            <div class="form-tip"></div>
          </el-form-item>
          <el-form-item label="销售量" prop="sell_volume">
            <el-input v-model="infoForm.sell_volume"></el-input>
            <div class="form-tip"></div>
          </el-form-item>

          <el-form-item label="商品图片" prop="list_pic_url">
            <el-upload
              name="goods_pic"
              action="https://127.0.0.1:8360/admin/upload/goodsPic"
              list-type="picture-card"
              :headers="uploaderHeader"
              :file-list="infoForm.list_pic_url"
              :on-success="handleUploadImageSuccess"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="form-tip">图片尺寸：750*420</div>
          </el-form-item>

          <el-form-item label="推荐类型">
              <el-checkbox label="新品" v-model="infoForm.is_new"></el-checkbox>
              <el-checkbox label="人气" v-model="infoForm.is_hot"></el-checkbox>
          </el-form-item>

          <el-form-item label="内容" prop="goods_desc">
            <el-upload
              name="goods_desc"
              action="https://127.0.0.1:8360/admin/upload/goodsDesc"
              list-type="picture-card"
              :headers="uploaderHeader"
              :file-list="infoForm.goods_desc"
              :on-success="handleUploadImageSuccess2"
              :on-remove="handleRemove1">
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="form-tip">图片尺寸：750*420</div>
          </el-form-item>

          <el-form-item label="上架">
            <el-switch v-model="infoForm.is_on_sale"></el-switch>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="infoForm.sort_order" :min="1" :max="1000"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitInfo">确定保存</el-button>
            <el-button @click="goBackPage">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/config/api';
  export default {
    data() {
      return {
        uploaderHeader: {
          'X-Nideshop-Token': localStorage.getItem('token') || '',
        },
        infoForm: {
          id: 0,
          name: "",
          primary_pic_url:'',
          list_pic_url: [],
          goods_brief:'',
          goods_desc:[],
          sort_order: 1,
          is_new: true,
          is_hot: true,
          new_pic_url: "",
          category_id:[],
          goods_unit:'瓶',
          is_on_sale:true,
          sell_volume:26,
          goods_number:99,
          retail_price:'',
          counter_price:''
        },
        categoryList:[],
        infoRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ]
        },
      }
    },
    methods: {
      goBackPage() {
        this.$router.go(-1);
      },
      onSubmitInfo() {
        this.$refs['infoForm'].validate((valid) => {
          if (valid) {
            if(this.infoForm.list_pic_url.length>0){
              this.infoForm.primary_pic_url = this.infoForm.list_pic_url[0]['url'];
            }
            let data={
              infoForm:this.infoForm
            };
            this.axios.post('goods/store', data.infoForm).then((response) => {
              if (response.data.errno === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                this.$router.go(-1)
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败'
                })
              }
            })
          } else {
            return false;
          }
        });
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList);
        this.infoForm.list_pic_url = fileList;
      },
      handleUploadImageSuccess(res, file) {
        let that = this;
        if (res.errno === 0) {
          that.infoForm.list_pic_url.push({url:res.data.url});
          
        }
      },
      handleRemove1(file, fileList) {
        // console.log(file, fileList);
        this.infoForm.goods_desc = fileList;
      },
      handleUploadImageSuccess2(res, file) {
        let that = this;
        if (res.errno === 0) {
          that.infoForm.goods_desc.push({url:res.data.url});
        }
      },
      getInfo() {
        let that = this;

        if (this.infoForm.id <= 0) {
          this.infoForm.id = 0;
        }

        //加载商品详情
        
        this.axios.get('goods/info', {
          params: {
            id: that.infoForm.id
          }
        }).then((response) => {
          if (this.infoForm.id != 0) {
            let resInfo = response.data.data.goodsData;
            resInfo.is_new = resInfo.is_new ? true : false;
            resInfo.is_hot = resInfo.is_hot ? true : false;
            resInfo.is_on_sale = resInfo.is_on_sale ? true : false;

            that.infoForm = resInfo;
          }

          that.categoryList = response.data.data.categoryList;
        })
      }

    },
    components: {},
    mounted() {
      this.infoForm.id = this.$route.query.id || 0;
      this.getInfo();
    }
  }

</script>

<style>
  .image-uploader{
    height: 105px;
  }
  .image-uploader .el-upload {
    border: 1px solid #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .image-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .image-uploader .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 187px;
    height: 105px;
    line-height: 105px;
    text-align: center;
  }

  .image-uploader .image-show {
    width: 187px;
    height: 105px;
    display: block;
  }

  .image-uploader.new-image-uploader {
    font-size: 28px;
    color: #8c939d;
    width: 165px;
    height: 105px;
    line-height: 105px;
    text-align: center;
  }

  .image-uploader.new-image-uploader .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 165px;
    height: 105px;
    line-height: 105px;
    text-align: center;
  }

  .image-uploader.new-image-uploader .image-show {
    width: 165px;
    height: 105px;
    display: block;
  }
</style>
