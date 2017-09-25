// scgkmx.js  生产工况明细
import { $wuxToast } from '../../../components/wux'
import req from '../../../utils/requestUtils'
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 'grid',
    columns: [
      {
        title: '品规名称',
        field: 'SPEC_NAME',
        width: 270
      },
      {
        title: '单元',
        field: 'UNIT_NAME',
        width: 120
      },
      {
        title: '任务编号',
        field: 'TASK_NO',
        width: 150
      },
      {
        title: '累计完成数',
        field: 'ALL_FNSH_NUM',
        width: 100
      },
      {
        title: '任务开始时间',
        field: 'TASK_BGN_TIME',
        width: 130
      },
    ],
    fields: [],
    datas:[],
    res: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let xtbh = options.xtbh;
    let cxrq = options.cxrq;
    let OPERNO = options.OPERNO;

    var that = this;
    var param = {
      operNo: OPERNO,
      sortNo: xtbh,
      statisDate: cxrq,
      paramNames: ['operNo', 'sortNo', 'statisDate']
    }
    var datacopy = req.postData('getProducDetail', param);

    //wsdlurl中设置需要访问的webservice的url地址
    var wsdlurl = 'https://www.iomgroup.cn/way/services/iomWay?wsdl';
    var targetNamespace = 'http://service.ws.iomWay.com/';

    wx.showToast({
      title: '数据查询中...',
      icon: 'loading',
      duration: 100000,
    })

    wx.request({
      url: wsdlurl,
      data: datacopy,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'content-type': 'text/xml; charset=utf-8',
        'SOAPAction': targetNamespace + 'getProducDetail',
      },
      // 设置请求的 header
      success: function (res) {
        // success
        wx.hideToast();
        var resData = req.parseWebServiceResponseData(res, 'getProducDetail');
        if (resData['RT_F'] == '1') {
          that.setData({
            res: resData,
          })
          that.parseData();
        } else {
          that.setData({
            res: [],
          })
          that.parseData();
          console.log(param);
          wx.showToast({
            title: resData['RT_D'],
          })
        }
      },
      fail: function (res) {
        // fail
        wx.hideToast();
        var resData = res.data;
        console.log(resData);
        wx.showToast({
          title: '网络故障',
        })
        
      },
      complete: function () {
        // complete 
        wx.hideToast();
      }
    });
  },

  parseData: function () {
    var keys = this.data.columns;
    var k = [];
    for (var i = 0; i < keys.length; i++) {
      k.push(keys[i]['field']);
    }
    var result = this.data.res;
    var d = result.RT_LIST || [];
    var dd = [];
    var bh = [];
    d.forEach(function (_d, index) {
      dd[index] = [];

      let n = 0;
      for (let j in _d) {
        if (n < k.length) {
          dd[index].push(_d[k[n]]);
          n++;
        }
      }
      bh.push(_d.SYS_NO);
    });
    this.setData({
      fields: k,
      datas: dd,
      xtbhs: bh,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
})