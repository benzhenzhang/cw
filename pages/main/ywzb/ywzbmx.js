// ywzbmx.js  运维指标明细

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
        title: '系统名称',
        field: 'SYS_NO',
        width: 120
      },
      {
        title: '单元名称',
        field: 'UNIT_NAME',
        width: 120
      },
      {
        title: '应反馈数',
        field: 'BEBACK_COUNT',
        width: 100
      },
      {
        title: '实际反馈数',
        field: 'BACK_COUNT',
        width: 100
      },
      {
        title: '及时反馈数',
        field: 'TIBACK_COUNT',
        width: 100
      },
      {
        title: '及时反馈率',
        field: 'TIBACK_RATE',
        width: 100
      },
      {
        title: '平均处理时长',
        field: 'AVGE_PROCE_TIME',
        width: 100
      },
      {
        title: '巡检超时数量',
        field: 'INSP_OVER_NUM',
        width: 100
      },
      {
        title: '确认超时数量',
        field: 'CNFM_OVER_NUM',
        width: 100
      },
      {
        title: '系统编号',
        field: 'SYS_SORT',
        hidden: 'none'
      }
    ],
    datas: [],
    fields: [],
    title_length:'',
    content_length:'',
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
    var datacopy = req.postData('getSerIndexDetail', param);

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
        'SOAPAction': targetNamespace + 'getSerIndexDetail',
      },
      // 设置请求的 header
      success: function (res) {
        // success
        wx.hideToast();
        var resData = req.parseWebServiceResponseData(res, 'getSerIndexDetail');
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
    var c = [];
    for (var i = 0; i < keys.length; i++) {
      k.push(keys[i]['field']);
      c.push(keys[i]['title']);
    }
    var result = this.data.res;
    var d = result.RT_LIST || [];
    var dd = [];
    var bh = [];
    k.forEach(function (_k, index) {
      dd[index] = [];
      for (let _d in d) {
        if (_d == 0) {
          dd[index].push(c[index]);
        }
        dd[index].push(d[_d][_k]);
        if (index == 0) {
          bh.push(d[_d].SYS_NO)
        }
      }
    });
    var t_length = '';
    var c_length = '';
    if(d.length===4){
      t_length = '20';
      c_length = '12';
    } else if (d.length === 3){
      t_length = '19';
      c_length = '19';
    } else if (d.length === 1) {
      t_length = '30';
      c_length = '57';
    }
    this.setData({
      fields: k,
      datas: dd,
      xtbhs: bh,
      title_length: t_length,
      content_length: c_length
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