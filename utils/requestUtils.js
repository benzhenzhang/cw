let req = {
  postData: function (methodName, param) {
    //method中设置你想调用的方法名
    var method = methodName;
    //wsdlurl中设置需要访问的webservice的url地址
    var wsdlurl = 'https://www.iomgroup.cn/way/services/iomWay?wsdl';
    var targetNamespace = 'http://service.ws.iomWay.com/';
    //datacopy中拼字符串，即http传输中的soap信息
    var datacopy = '<?xml version="1.0" encoding="utf-8"?>';
    datacopy += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.iomWay.com/">';
    datacopy += '<soapenv:Header/>';
    datacopy += '<soapenv:Body>';
    //接着拼你要访问的方法名、参数名和你传递的实参值，比如我要访问的方法是getReader(String arg0,int arg1)
    //而我的实际调用是operLogin('jlzr','0000aaaa','127.0.0.1','IOM20170731jlzr1231')，所以拼字符串如下
    datacopy += '<ser:' + methodName + '>';
    for (let index in param['paramNames']) {
      datacopy += '<arg' + index + '>' + param[param['paramNames'][index]] + '</arg' + index + '>';
    }
    datacopy += '</ser:' + methodName + '>';
    datacopy += '</soapenv:Body>';
    datacopy += '</soapenv:Envelope>';
    
    return datacopy;
  },
  parseWebServiceResponseData: function(res,methodName){
    var X2JS = require('../utils/x2js/x2js');
    var x2js = new X2JS();
    var document = x2js.xml2js(res.data);
    var resStr = document['Envelope']['Body'][methodName + 'Response'][methodName + 'Return']['__text'];
    var resData = JSON.parse(resStr);
    return resData[0];
  }
}

export default req;