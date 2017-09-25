// index.js
var config = require('../../../config.js');
var app = getApp();
Page({
  data: {
    type: `grid`,
    OPERNO:'',
    DEPTNO:'',
    components: [
      {
        title: '生产工况',
        remark: '生产工况',
        url: '/pages/main/scgk/index',
        icon: '../../../assets/images/product_state.png',
      },
      {
        title: '运维指标',
        remark: '运维指标',
        url: '/pages/main/ywzb/index',
        icon: '../../../assets/images/protected_points.png',
      },
      {
        title: '运行指标',
        remark: '运行指标',
        url: '/pages/main/yxzb/index',
        icon: '../../../assets/images/working_points.png',
      },
      {
        title: '重要事件',
        remark: '重要事件',
        url: '/pages/main/zysj/index',
        icon: '../../../assets/images/import_things.png',
      },
    ],
  },
  modSwitch(e) {
    this.setData({
      type: e.currentTarget.dataset.type,
    })
  },
  onLoad: function (options){
    this.setData({
      OPERNO : options.OPERNO,
      DEPTNO : options.DEPTNO
    }) 
  },
  
})