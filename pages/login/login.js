//login.js
import { $wuxToast } from '../../components/wux'
import req  from '../../utils/requestUtils'
var config = require('../../config.js');
var app = getApp();
Page({
  data:{
    username:"",
    password:"",
    url:""
  },
  onLoad:function(options){
    this.setData({
      url:options.url || '../main/home/index'
    })
  },
  textinput: function (event) {
    var type = event.currentTarget.dataset.type;
    if (type == 1) {
      this.setData({
        username: event.detail.value
      })
    } else {
      this.setData({
        password: event.detail.value
      })
    }
  },
  login:function(){
    var that = this;

    var username = this.data.username;
    var password = this.data.password;
    if (username == null || username.trim() == ''){
      wx.showToast({
        title: '账号不能为空!',
        icon: 'warn'
      })
      return ;
    }

    if (password == null || password == '') {
      wx.showToast({
        title: '密码不能为空!',
        icon: 'warn'
      })
      return;
    }

    var param = {
      username: username.trim(),
      password: password,
      ip: '127.0.0.1',
      sessionId: 'IOM20170731JLZR1235',
      paramNames: ['username', 'password', 'ip','sessionId']
    }
    var datacopy = req.postData('operLogin',param);

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
        var resData = req.parseWebServiceResponseData(res,'operLogin');
        // console.log(resData['RT_LIST']);
        if(resData['RT_F'] == '1'){
          wx.redirectTo({
            url: '../main/home/index?OPERNO=' + resData['OPERNO'] + '&DEPTNO=' + resData['DEPTNO'], 
          })
        }else{
          $wuxToast.show({
            type: 'text',
            timer: 1000,
            color: '#fff',
            text: resData['RT_D'],
            success: () => console.log('登录失败')
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
  register:function(){
    var that = this;
    wx.navigateTo({
      url: '../main/register/index'
    })
  }
})