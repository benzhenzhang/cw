// index.js  运维指标统计
import { $wuxCalendar } from '../../../components/wux'
var util = require('../../../utils/util.js');  
import req from '../../../utils/requestUtils'
var app = getApp();
Page({
  data:{
    cxrq: util.getYestoday(new Date()),
    type:'grid',
    columns: [
      {
        title: '系统名称',
        field: 'SYS_NAME',
        width: 49
      },
      {
        title: '应反馈数',
        field: 'BEBACK_COUNT',
        width: 49
      },
      {
        title: '实际反馈数',
        field: 'BACK_COUNT',
        width: 49
      },
      {
        title: '及时反馈数',
        field: 'TIBACK_COUNT',
        width: 49
      },
      {
        title: '及时反馈率',
        field: 'TIBACK_RATE',
        width: 49
      },
      {
        title: '平均处理时长',
        field: 'AVGE_PROCE_TIME',
        width: 49
      },
      {
        title: '巡检超时数量',
        field: 'INSP_OVER_NUM',
        width: 49
      },
      {
        title: '确认超时数量',
        field: 'CNFM_OVER_NUM',
        width: 49
      },
      {
        title: '系统编号',
        field: 'SYS_NO',
        hidden: 'none'
      }
    ],
    datas: [],
    fields: [],
    xtbhs: [],
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      OPERNO: options.OPERNO,
      DEPTNO: options.DEPTNO
    })

    this.query();
  },
  query:function(){
    var that = this;
    var param = {
      operNo: that.data.OPERNO,
      deptNo: that.data.DEPTNO,
      statisDate: that.data.cxrq,
      paramNames: ['operNo', 'deptNo', 'statisDate']
    }
    var datacopy = req.postData('getSerIndexList', param);

    //wsdlurl中设置需要访问的webservice的url地址
    var wsdlurl = 'https://www.iomgroup.cn/way/services/iomWay?wsdl';
    var targetNamespace = 'http://service.ws.iomWay.com/';

    wx.showToast({
      title: '数据查询中...',
      icon: 'loading',
      duration: 49000,
    })

    wx.request({
      url: wsdlurl,
      data: datacopy,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'content-type': 'text/xml; charset=utf-8',
        'SOAPAction': targetNamespace + 'getSerIndexList',
      },
      // 设置请求的 header
      success: function (res) {

        // success
        wx.hideToast();
        var resData = req.parseWebServiceResponseData(res, 'getSerIndexList');
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
        console.log(param);
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
    this.setData({
      fields: k,
      datas: dd,
      xtbhs: bh,
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  queryDetail: function (e) {
    let xtbh = e.currentTarget.dataset.xtbh;
    app.requestDetailxtbh = xtbh;
    wx.navigateTo({
      url: 'ywzbmx?xtbh=' + xtbh + '&cxrq=' + this.data.cxrq + '&OPERNO=' + this.data.OPERNO,
    })
  },
  openCalendar() {
    if (this.cxrq) {
      return this.cxrq.show()
    }
    this.cxrq = $wuxCalendar.init('cxrq', {
      value: [util.getYestoday(new Date())],
      onChange(p, v, d) {
        this.setData({
          cxrq: d.join(', ')
        })
      }
    })
  },
})