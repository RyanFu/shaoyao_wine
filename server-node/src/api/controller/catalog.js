const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取分类栏目数据
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  async indexAction() {
    // const categoryId = this.get('id');
    const data = await this.model('category').field('id,parent_id,name,wap_banner_url,front_name').select();

    function test(result, pid) {
      var rtn = [];
      for (var i in result) {
        if (result[i].parent_id == pid) {
          result[i].children = test(result, result[i].id);
          rtn.push(result[i]);
        }
      }
      return rtn;
    }
    let tree = test(data, 0);
    return this.success({
      categoryList: tree
    });

    // let currentCategory = null;
    // if (categoryId) {
    //   currentCategory = await model.where({'id': categoryId}).find();
    // }

    // if (think.isEmpty(currentCategory)) {
    //   currentCategory = data[0];
    // }

    // // 获取子分类数据
    // if (currentCategory && currentCategory.id) {
    //   currentCategory.subCategoryList = await model.where({'parent_id': currentCategory.id}).select();
    // }

    // return this.success({
    //   categoryList: data,
    //   currentCategory: currentCategory
    // });
  }

  async currentAction() {
    const categoryId = this.get('id');
    const model = this.model('category');

    let currentCategory = null;
    if (categoryId) {
      currentCategory = await model.where({
        'id': categoryId
      }).find();
    }
    // 获取子分类数据
    if (currentCategory && currentCategory.id) {
      currentCategory.subCategoryList = await model.where({
        'parent_id': currentCategory.id
      }).select();
    }

    return this.success({
      currentCategory: currentCategory
    });
  }
};