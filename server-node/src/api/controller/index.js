const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const banner = await this.model('ad').where({
      ad_position_id: 1
    }).select();
    const channel = await this.model('channel').order({
      sort_order: 'asc'
    }).select();
    const newGoods = await this.model('goods').field(['id', 'name', 'primary_pic_url', 'retail_price']).where({
      is_new: 1
    }).limit(4).select();

    // for (let i in newGoods) {
    //   newGoods[i]['list_pic_url'] = JSON.parse(newGoods[i]['list_pic_url']);
    // }

    const hotGoods = await this.model('goods').field(['id', 'name', 'primary_pic_url', 'goods_brief', 'retail_price']).where({
      is_hot: 1
    }).limit(3).select();

    const notice = await this.model('notice').field(['content']).where({
      id: 1
    }).find();


    const categoryList = await this.model('category').where({
      is_home: 1
    }).select();
    const newCategoryList = [];
    for (const categoryItem of categoryList) {

      const categoryGoods = await this.model('goods').field(['id', 'name', 'primary_pic_url', 'retail_price']).where({
        category_id: ['like', '%@' + categoryItem.id + '@%']
      }).limit(6).select();

      newCategoryList.push({
        id: categoryItem.id,
        name: categoryItem.name,
        img: categoryItem.wap_banner_url,
        goodsList: categoryGoods
      });
    }

    return this.success({
      banner: banner,
      channel: channel,
      newGoodsList: newGoods,
      hotGoodsList: hotGoods,
      topicList: [], //专题
      categoryList: newCategoryList,
      notice: notice.content,
      titleImages: {
        newGoods: '../../static/title/newwine.jpg',
        hotGoods: '../../static/title/hotrecommend.jpg'
      }
    });
  }
};