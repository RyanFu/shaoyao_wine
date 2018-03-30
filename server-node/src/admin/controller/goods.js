const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';

    const model = this.model('goods');
    const data = await model.where({
      name: ['like', `%${name}%`]
    }).order(['id DESC']).page(page, size).countSelect();

    return this.success(data);
  }

  async infoAction() {
    const id = this.get('id');
    let goodsData = {};
    if (id != 0) {
      goodsData = await this.model('goods').where({
        id: id
      }).find();

      goodsData.list_pic_url = JSON.parse(goodsData.list_pic_url);

      goodsData.goods_desc = JSON.parse(goodsData.goods_desc);;

      let category_id = [];
      let gcids = goodsData.category_id.substring(1);
      gcids.substring(0,gcids.length-1).split('@').forEach(function(item) {
        category_id.push(parseInt(item));
      });

      goodsData.category_id = category_id;

    }

    const categoryData = await this.model('category').field(['id', 'name', 'parent_id']).where({
      is_show: 1
    }).order(['sort_order ASC']).select();
    const topCategory = categoryData.filter((item) => {
      return item.parent_id === 0;
    });
    const categoryList = [];
    topCategory.map((item) => {
      item.level = 1;
      categoryList.push(item);
      categoryData.map((child) => {
        if (child.parent_id === item.id) {
          child.level = 2;
          categoryList.push(child);
        }
      });
    });


    return this.success({
      goodsData: goodsData,
      categoryList: categoryList
    });
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('goods');
    values.is_on_sale = values.is_on_sale ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    values.is_hot = values.is_hot ? 1 : 0;
    values.list_pic_url = JSON.stringify(values.list_pic_url);
    values.goods_desc = JSON.stringify(values.goods_desc);
    values.category_id = "@" + values.category_id.join("@") + '@';

    if (id > 0) {
      await model.where({
        id: id
      }).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success(values);
  }

  async destoryAction() {
    const id = this.post('id');
    await this.model('goods').where({
      id: id
    }).limit(1).delete();


    return this.success();
  }
};