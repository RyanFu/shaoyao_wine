const Base = require('./base.js');
const fs = require('fs');
const qiniu = require('qiniu');

function _upload(localFile) {
  let qnConfig = {
    bucket: 'syjp-images',
    access: '',
    secret: '',
    domain: 'http://image.域名.com/'
  };

  let mac = new qiniu.auth.digest.Mac(qnConfig.access, qnConfig.secret);
  let qiniuConfig = new qiniu.conf.Config();
  qiniuConfig.zone = qiniu.zone.Zone_z2;
  let putPolicyImage = new qiniu.rs.PutPolicy({
    scope: qnConfig.bucket, //qiniuZip
    expires: 17200
  });
  let uploadImageToken = putPolicyImage.uploadToken(mac);
  let resumeUploaderImage = new qiniu.resume_up.ResumeUploader(qiniuConfig);
  let putExtraImage = new qiniu.resume_up.PutExtra();

  let fileName = think.md5(localFile) + '.i.o.y.1'; // + Tool._TIME()
  let key = fileName;
  let fileLink = qnConfig.domain + fileName;

  console.log('开始上传Image文件....');
  putExtraImage.fname = key;

  // 如果指定了断点记录文件，那么下次会从指定的该文件尝试读取上次上传的进度，以实现断点续传
  putExtraImage.resumeRecordFile = 'progress_img.log';
  putExtraImage.progressCallback = function(readLen, fileSize) {
    console.log('上传进度:' + (readLen / fileSize * 100).toFixed(1) + '%');
  };
  return new Promise(resolve => {
    resumeUploaderImage.putFile(uploadImageToken, key, localFile, putExtraImage, function(respErr, respBody, respInfo) {
      if (respErr) {
        console.log(respErr);
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        console.log('上传成功');
        // callback(fileLink);
        resolve(fileLink);
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
    });
  });
}


module.exports = class extends Base {

  async goodsPicAction() {
    const brandFile = this.file('goods_pic');
    if (think.isEmpty(brandFile)) {
      return this.fail('保存失败');
    }
    let imgurl = await _upload(brandFile.path);

    return this.success({
      name: 'goods_pic',
      url: imgurl
    });
  }
  async goodsDescAction() {
    const brandFile = this.file('goods_desc');

    if (think.isEmpty(brandFile)) {
      return this.fail('保存失败');
    }
    let imgurl = await _upload(brandFile.path);

    return this.success({
      name: 'goods_desc',
      url: imgurl
    });
  }

  async brandPicAction() {
        const imageFile = this.file('brand_pic');

    if (think.isEmpty(imageFile)) {
      return this.fail('保存失败');
    }
    let imgurl = await _upload(imageFile.path);

    return this.success({
      name: 'brand_pic',
      url: imgurl
    });

  }
  async brandNewPicAction() {
    const imageFile = this.file('brand_new_pic');

    if (think.isEmpty(imageFile)) {
      return this.fail('保存失败');
    }
    let imgurl = await _upload(imageFile.path);

    return this.success({
      name: 'brand_new_pic',
      url: imgurl
    });
  }

  async categoryWapBannerPicAction() {

    const imageFile = this.file('wap_banner_pic');

    if (think.isEmpty(imageFile)) {
      return this.fail('保存失败');
    }
    let imgurl = await _upload(imageFile.path);

    return this.success({
      name: 'wap_banner_url',
      url: imgurl
    });


  }

  async topicThumbAction() {
    const imageFile = this.file('scene_pic_url');

    if (think.isEmpty(imageFile)) {
      return this.fail('保存失败');
    }
    let imgurl = await _upload(imageFile.path);

    return this.success({
      name: 'scene_pic_url',
      url: imgurl
    });
  }
};