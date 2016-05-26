
var Ding = (function(){
	
	function getUrlParams() {
		var url = location.search;
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			strs = url.substr(1).split("&");
			for(var i = 0; i < strs.length; i ++) {
				theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	}
	
	function isPC() {
		var flag = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	    return flag;
	}
	
	return {
		handle: function(appId, checkURI, backfunc, apiList){
			
			var isPCFlag = isPC();
			
			if(!isPCFlag){
				dd = DingTalkPC;
			}
			
			var _config = {};
			var _user = {};
			var _apiList = ["runtime.info", "runtime.permission.requestAuthCode", "biz.navigation.setRight", "device.notification.confirm", "device.notification.alert"];
			
			$.ajax({
				type: 'POST',
				url: config.serverHost + "requestDDConfig.do?timestamp=" + new Date().getTime(),
				data: {"url": checkURI},
				dataType : "json",
				async: false,
				success: function(res){
					_config = eval(res.configInfo);
				},
			});
			
			if(apiList != null && apiList != undefined){
				_apiList = _apiList.concat(apiList);
			}
			
			dd.config({
			    appId: appId,
			    corpId: _config.corpId,
			    timeStamp: _config.timeStamp,
			    nonceStr: _config.nonceStr,
			    signature: _config.signature,
			    jsApiList: _apiList
			});
			
			dd.ready(function() {
				
				if(isPCFlag){
					dd.biz.navigation.setRight({
						show: false,
					});
				}
				
				dd.runtime.permission.requestAuthCode({
			        corpId: _config.corpId,
			        onSuccess: function (info) {
			        	
			            $.ajax({
			            	type: 'POST',
			                url: config.serverHost + '/queryDDUserInfo.do?timestamp=' + new Date().getTime(),
			                data: {"code": info.code},
			                async: false,
			                success: function (data, status, xhr) {

			                	_user = data.user;
			                	
			                	if(data.errorCode == 0){
			                		if(_user.userid){
			                			
			                			$.ajax({
			                		    	type: 'POST',
			                		        url: config.serverHost + '/requestAuthCode.do?timestamp=' + new Date().getTime(),
			                		        data: {"userId": _user.userid},
			                		        async: false,
			                		        success: function (data, status, xhr) {
			                		        	if(data.errorCode == 0){
			                		        		
			                		        		_config.authenticationEncode =  data.authenticationEncode;
			                		        		
			                		        		backfunc(_config, _user);
			                			       	}else{
			                			       		dd.device.notification.alert({
			                			       		    message: data.errorMsg,
			                			       		    title: "系统提示",
			                			       		    buttonName: "确认",
			                			       		});
			                			       	}
			                		        }, error: function (xhr, errorType, error) {
			                		        	dd.device.notification.alert({
				                		   		    message: "系统错误" + error,
				                		   		    title: "提示",
				                		   		    buttonName: "确认",
			                		       		});
			                		        }
			                		    });
			                		}else{
			                			dd.device.notification.alert({
				                		    message: "获取用户信息失败",
				                		    title: "系统提示",
				                		    buttonName: "确认",
				                		});
			                		}
			                	}else{
			                		dd.device.notification.alert({
			                		    message: data.errorMsg,
			                		    title: "系统提示",
			                		    buttonName: "确认",
			                		});
			                	}
			                	
			                }, error: function (xhr, errorType, error) {
			                	dd.device.notification.alert({
		                		    message: "错误" + error + errorType,
		                		    title: "提示",
		                		    buttonName: "确认",
		                		});
			                }
			            });
			            
			        }, onFail: function (err) {
			        	
			        	dd.device.notification.alert({
		        		    message: "钉钉错误-" + err.reason + "-" + err.code,
		        		    title: "钉钉提示",
		        		    buttonName: "确认",
		        		});
			        }
			    });
			});
			
			dd.error(function(err) {
			    dd.device.notification.alert({
				    message: "系统错误:" + err.message + "-" + err.code,
				    title: "钉钉提示",
				    buttonName: "确认",
				});
			});
		}
	}
	
})();