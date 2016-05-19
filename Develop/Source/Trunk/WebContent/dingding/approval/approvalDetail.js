ApprovalDetail = (function(){

	var apconfig = {
		flag : false,
		hostAddr : null,
		authentication : "",
		approvalType : null,
		approParams : {},
		getApprovalType : function(){
			var approvalType = {};
			var that = this;

			$.ajax({
				type: 'GET',
				url: that.hostAddr + "/ds/approvalType.json",
				data: {},
				async: false,
				success: function(res){
					$.each(res.approvalType, function(i, v){
						approvalType[v.key] = v.value;
					});
				}
			});

			that.approvalType = approvalType;
		},
		getUrlParams : function(){
			var url = location.search;

			var theRequest = new Object();
			url && (url = decodeURI(url));
			if (url.indexOf("?") != -1) {
				strs = url.substr(1).split("&");
				for(var i = 0; i < strs.length; i ++) {
					theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
				}
			}
			return theRequest;
		}
	};

	var binding = {
		viewApproval : function(params){
			$.ajax({
				type: 'POST',
				url: apconfig.hostAddr + '/queryApprovalByAId.do',
				data: params,
				async: false,
				success: function (data, status, xhr) {

					if(data.errorCode == 0){

						var _a = data.approval;
						$("#approvalType").text(apconfig.approvalType[_a.type]);
						$("#senderName").text(_a.senderName);
						$("#createTime").text(_a.createTime);
						$("#contents").text(_a.contents);
						$("#comment").text(_a.comment);
						apconfig.flag = true;

					}else{
						$.alert(data.errorMsg);
					}

				}, error: function (xhr, errorType, error) {
					$.alert("系统错误");
				}
			});
		},

		approve : function(type){

			var url = null;

			if(type == 0){
				url = apconfig.hostAddr + '/approveApproval.do';
			}else if(type == 1){
				url = apconfig.hostAddr + '/refuseApproval.do';
			}

			$.confirm('是否通过审批当前信息', function () {
				$.ajax({
					type: 'POST',
					url: url,
					data: apconfig.approParams,
					async: false,
					success: function (data, status, xhr) {

						var message = "操作成功";

						if(!data.errorCode == 0){
							message = data.errorMsg;
						}else{
							$("#approveBtn").hide();
							$("#refuseBtn").hide();
						}

						$.alert(message);


					}, error: function (xhr, errorType, error) {

						$.alert("系统错误");

					}
				});
			});

	},

		init : function(){
			var that = this;
			$("#approveBtn").on("click", function(){
				that.approve(0);
			});

			$("#refuseBtn").on("click", function(){
				that.approve(1);
			});
		}
	};

	return {
		init : function(){
			var searchParam = apconfig.getUrlParams();
			apconfig.hostAddr = "http://" + window.location.host;
			apconfig.approParams = searchParam;

			apconfig.getApprovalType();
			binding.viewApproval(searchParam);
			binding.init();
		}
	};
})();


$(function(){

	ApprovalDetail.init();

});





