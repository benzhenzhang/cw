// index.js  运行指标统计
import { $wuxPicker, $wuxPickerCity } from '../../../components/wux' 
import req from '../../../utils/requestUtils'
var app = getApp();
Page({
  data:{
    type: 'grid',
    cxrq: (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1),
    columns: [
      {
        title: '系统名称',
        field: 'SYS_NAME',
        width: 120
      },
      {
        title: '告警总数',
        field: 'ALARM_COUNT',
        width: 100
      },
      {
        title: 'TOP1告警名称',
        field: 'TOP1_CODE',
        width: 150
      },
      {
        title: 'TOP1告警总数',
        field: 'TOP1_COUNT',
        width: 100
      },
      {
        title: 'TOP2告警名称',
        field: 'TOP2_CODE',
        width: 150
      },
      {
        title: 'TOP2告警总数',
        field: 'TOP2_COUNT',
        width: 100
      },
      {
        title: 'TOP3告警名称',
        field: 'TOP3_CODE',
        width: 150
      },
      {
        title: 'TOP3告警总数',
        field: 'TOP3_COUNT',
        width: 100
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
  query: function () {
    var that = this;
    var param = {
      operNo: that.data.OPERNO,
      deptNo: that.data.DEPTNO,
      statisDate: that.data.cxrq,
      paramNames: ['operNo', 'deptNo', 'statisDate']
    }
    var datacopy = req.postData('getRunIndexList', param);

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
        'SOAPAction': targetNamespace + 'getRunIndexList',
      },
      // 设置请求的 header
      success: function (res) {

        // success
        wx.hideToast();
        var resData = req.parseWebServiceResponseData(res, 'getRunIndexList');
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
    // that.parseData();
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
      url: 'yxzbmx?xtbh=' + xtbh + '&cxrq=' + this.data.cxrq + '&OPERNO=' + this.data.OPERNO,
    })
  },
  openTap() {
    $wuxPicker.init('cxrq', {
      title: "请选择查询日期",
      cols: [
        {
          textAlign: 'center',
          values: ['2014', '2015', '2016', '2017']
        },
        {
          textAlign: 'center',
          values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
      ],
      value: [3, (new Date()).getMonth()],
      onChange(p) {
        this.setData({
          cxrq: p['value'][0] + '-' + p['value'][1]
        })
      },
    })
  },
})