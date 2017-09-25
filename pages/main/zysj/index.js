// index.js  重要事件
import req from '../../../utils/requestUtils'
var app = getApp();
Page({
  data: {
    type: 'grid',
    columns: [
      { title: '工单编号', field: 'WORK_ORDER_NO', width: 120 },
      { title: '工单状态', field: 'FLAG', width: 120 },
      { title: '设备名称', field: 'EQUIP_NAME', width: 120 },
      { title: '发生时间', field: 'CREAT_DATE', width: 120 },
      { title: '故障现象', field: 'FAULT_APRC', width: 120 },
      { title: '维修开始时间', field: 'PLAN_BGN_TIME', width: 120 },
      { title: '维修结束时间', field: 'PLAN_END_TIME', width: 120 },
      { title: '维修方案', field: 'REPAIR_SCHEME', width: 120 },
    ],
    datas: [],
    fields: [],
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.setData({
      OPERNO: options.OPERNO,
      DEPTNO: options.DEPTNO
    })

    this.query();

    var keys = this.data.columns;
    var k = [];
    for (var i = 0; i < keys.length; i++) {
      k.push(keys[i]['field']);
    }
    // var d = [
    //   {
    //     GDBH: 'D2017042010213028322',
    //     GDZT: '未归档',
    //     SBMC: '互感器01号线004号检定装置',
    //     FSSJ: '2017/4/20 10:17:56',
    //     GZXX: '',
    //     WXKSSJ: '2017/4/20 10:16:00',
    //     WXJSSJ: '2017/4/20 13:16:00',
    //     WXFA: '检修调压器控制电路。',
    //   },
    //   {
    //     GDBH: 'D2017031410213024960',
    //     GDZT: '已归档',
    //     SBMC: '互感器01号线003号耐压检定软件',
    //     FSSJ: '2017/3/14 9:53:45',
    //     GZXX: '',
    //     WXKSSJ: '2017/3/14 9:50:00',
    //     WXJSSJ: '2017/3/15 12:00:00',
    //     WXFA: '检查控制线路，更换固态继电器。',
    //   },
    //   {
    //     GDBH: 'D2017051810213030107',
    //     GDZT: '未归档',
    //     SBMC: '互感器01号线001号多功能检定软件',
    //     FSSJ: '2017/5/18 12:26:10',
    //     GZXX: '',
    //     WXKSSJ: '2017/5/18 12:25:00',
    //     WXJSSJ: '2017/5/18 13:26:00',
    //     WXFA: '查看电容补偿箱的端子',
    //   },];
    
    // this.setData({
    //   fields: k,
    //   datas: d,
    // })
  },
  query:function(){
    var that = this;
    var param = {
      operNo: that.data.OPERNO,
      deptNo: that.data.DEPTNO,
      paramNames: ['operNo', 'deptNo']
    }
    var datacopy = req.postData('getEventList', param);

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
        'SOAPAction': targetNamespace + 'getEventList',
      },
      // 设置请求的 header
      success: function (res) {

        // success
        wx.hideToast();
        var resData = req.parseWebServiceResponseData(res, 'getEventList');
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
    for (var i = 0; i < keys.length; i++) {
      k.push(keys[i]['field']);
    }
    var d = this.data.res['RT_LIST'];
    this.setData({
      fields: k,
      datas: d,
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
  }
})