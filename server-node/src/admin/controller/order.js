const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const orderSn = this.get('orderSn') || '';
    const consignee = this.get('consignee') || '';

    const model = this.model('order');
    const data = await model.where({
      order_sn: ['like', `%${orderSn}%`],
      consignee: ['like', `%${consignee}%`]
    }).order(['id DESC']).page(page, size).countSelect();
    const newList = [];
    for (const item of data.data) {
      item.order_status_text = await this.model('order').getOrderStatusText(item.id);
      newList.push(item);
    }
    data.data = newList;
    return this.success(data);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('order');
    const orderInfo = await model.where({
      id: id
    }).find();

    orderInfo.province_name = await this.model('region').where({
      id: orderInfo.province
    }).getField('name', true);
    orderInfo.city_name = await this.model('region').where({
      id: orderInfo.city
    }).getField('name', true);
    orderInfo.district_name = await this.model('region').where({
      id: orderInfo.district
    }).getField('name', true);
    orderInfo.full_region = orderInfo.province_name + orderInfo.city_name + orderInfo.district_name;

    orderInfo.order_status_text = await this.model('order').getOrderStatusText(id);

    const orderGoods = await this.model('order_goods').where({
      order_id: id
    }).select();
    return this.success({
      orderInfo: orderInfo,
      orderGoods: orderGoods,
    });
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('order');
    values.is_show = values.is_show ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
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
  async deliveryAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');
    const num = this.post('num');
    const shipper_name = this.post('shipper_name');
    const shipper_code = this.post('shipper_code');

    const model = this.model('order');
    const order_express = this.model('order_express');

    //update 状态
    let up = await model.where({
      id: id
    }).update({
      order_status: 300
    });

    if (up) {
      await order_express.add({
        order_id: id,
        logistic_code: num,
        shipper_name: shipper_name,
        shipper_code: shipper_code,
        add_time: Date.now(),
        update_time: Date.now(),
      });
    }


    return this.success(values);
  }

  async destoryAction() {
    const id = this.post('id');
    await this.model('order').where({
      id: id
    }).limit(1).delete();

    // 删除订单商品
    await this.model('order_goods').where({
      order_id: id
    }).delete();

    // TODO 事务，验证订单是否可删除（只有失效的订单才可以删除）

    return this.success();
  }
};