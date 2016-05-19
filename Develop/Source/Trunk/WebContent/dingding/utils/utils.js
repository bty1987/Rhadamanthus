var utils = {
	getUrlParams: function() {
		var url = location.search;
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			strs = url.substr(1).split("&");
			for(var i = 0; i < strs.length; i ++) {
				theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	}, post: function(url, options, callback, failCallback, asyncFlag) {
		var dfd = $.Deferred(); 
		var opts = $.extend({}, options || {});
		var optAsync = true;
		if(asyncFlag == undefined || asyncFlag == true){
			optAsync = true;
		}else{
			optAsync = false;
		}
		
		$.ajax({
			url: url,
			data: opts,
			type: "post",
			dataType: "json",
			async: optAsync, //设为false就是同步请求
			success: function(res) {
				if(res == null){
					return;
				}
				
				if(res.errorCode == 0) {
					if(callback){
						callback(res);
					}else{
						com.showAlert(com.info, "操作成功");
						dfd.resolve(res);
						return res;
					}
				}else if(res.errorCode == 110005){
					isF5 = true;
					window.location.href = api.common.logout.url + "?timestamp="+new Date().getTime();
				}else{
					var errorMsg = res.errorMsg;
					com.showAlert(com.error, errorMsg);
					if(failCallback)
						failCallback(errorMsg);
					else{
						dfd.reject(res);
						return res;
					}
				}
			}, error: function(msg) {
				com.showAlert(com.error, msg);
				if(failCallback){
					failCallback(msg);
				}
			}
		});
		return dfd.promise();
	}
}