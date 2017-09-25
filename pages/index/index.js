//index.js
//获取应用实例
var config = require('../../config.js');
import req from '../../utils/requestUtils'
var app = getApp();
Page({
  data: {
    motto: '',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    this.login();
  },
  login: function () {
    var that = this;

    var username = config.username;
    var password = config.password;
    if (username == null || username.trim() == '') {
      wx.redirectTo({
        url: '../login/login',
      })
      return;
    }

    if (password == null || password == '') {
      wx.redirectTo({
        url: '../login/login',
      })
      return;
    }

    var param = {
      username: username.trim(),
      password: password,
      ip: '127.0.0.1',
      sessionId: 'IOM20170731JLZR1235',
      paramNames: ['username', 'password', 'ip', 'sessionId']
    }
    var datacopy = req.postData('operLogin', param);

    //wsdlurl中设置需要访问的webservice的url地址
    var wsdlurl = 'https://www.iomgroup.cn/way/services/iomWay?wsdl';
    var targetNamespace = 'http://service.ws.iomWay.com/';

    wx.showToast({
      title: '登录中...',
      icon: 'loading'
    })

    wx.request({
      url: wsdlurl,
      data: datacopy,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'content-type': 'text/xml; charset=utf-8',
        'SOAPAction': targetNamespace + 'operLogin',
      },
      // 设置请求的 header
      success: function (res) {
        // success
        config.username = param.username;
        config.password = param.password;
        wx.hideToast();
        var resData = req.parseWebServiceResponseData(res, 'operLogin');
        // console.log(resData['RT_LIST']);
        if (resData['RT_F'] == '1') {
          wx.redirectTo({
            url: '../main/home/index?OPERNO=' + resData['OPERNO'] + '&DEPTNO=' + resData['DEPTNO'],
          })
        } else {
          wx.redirectTo({
            url: '../login/login',
          })
        }
      },
      fail: function (res) {
        // fail
        var resData = res.data;
        console.log(resData);
        $wuxToast.show({
          type: 'forbidden',
          timer: 1500,
          color: '#fff',
          text: '网络故障',
          success: () => console.log('网络故障')
        })
      },
      complete: function () {
        // complete 
      }
    })
    // if(that.data.username == userName && that.data.password == pwd){

    // } else {
    //   wx.hideToast();

    // }
  },
})
