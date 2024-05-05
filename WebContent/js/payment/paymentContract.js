jQuery(function($) {

    var paymentContract = {
     
        pcid : null,

        modals: {
            qrcodeModal: null,
            paymentContractModal: com.focusPage("#paymentContractModal")
        },
        items: {
            orderId: com.focusPage("#orderId"),
            paymentType: com.focusPage("#paymentType"),
            viewpdf: com.focusPage("#viewpdf"),
            download: com.focusPage("#download"),
            signet: com.focusPage("#signet"),
            creater: com.focusPage("#creater"),
            signner: com.focusPage("#signner"),
            createTime: com.focusPage("#createTime"),
            comsignTime: com.focusPage("#comsignTime"),
            cussignTime: com.focusPage("#cussignTime"),

            qrcode: null
        },
        btns: {
            signBtn: com.focusPage("#signBtn", "#paymentContractModal")
        },
        paymentTypes: constant.payment().receipt.paymentType.keys,
        status: constant.payment().paymentContract.status.keys
    };
 	
    paymentContract.modals.qrcodeModal = com.initForm("qrcodeModal", "二维码", [{"id": "qrcode", "type": "div", "clazz": "qrcode"}], []);
    paymentContract.items.qrcode = com.focusPage("#qrcode");
    
	paymentContract.modals.paymentContractModal.on('show.bs.modal',function(e){
		com.cleanItems(paymentContract.items);
		com.clearValidator();
	});
	
	com.post(api.data.querySignet, {}, function (res) {
		paymentContract.items.signet.bindData(res.signets, "sid", "name", false);
	});
	
    var searcher = new Searcher();
      
    searcher.base("condList", "pagenation", "resultList", api.payment.pagePaymentContract);
      
    searcher.condition(["payment-orderId","payment-paymentType","payment-activity-creater-name","payment-createTime"]);
      
    var lineprops = [
        {field: "paymentType", name: "款项类型", prop: "paymentType", clazz: "red", dataset: paymentContract.paymentTypes},
        {field: "creater", name: "创建人", prop: "creater.currentName", clazz: "grey"},
        {field: "signner", name: "签署人", prop: "signner.currentName", clazz: "grey"},
        {field: "createTime", name: "创建时间", prop: "createTime", clazz: "green"},
        {field: "comsignTime", name: "公司签时间", prop: "comsignTime", clazz: "green"},
        {field: "cussignTime", name: "客户签时间", prop: "cussignTime", clazz: "green"},
        {field: "status", name: "状态", prop: "status", clazz: "red", dataset: paymentContract.status}
    ];      
      
    var linebtns = [
        {name: "查看", clazz: "btn-yellow", handle: function(v){
        	com.post(api.payment.viewPaymentContract , {"paymentContract.pcid" : v.pcid}, function (res) {
            	com.popup4frame("合同查看", res.redirect);
            });
        }},
        {name: "公司签", clazz: "btn-success", handle: function(v){
        	paymentContract.pcid = v.pcid;
        	  
        	paymentContract.modals.paymentContractModal.modal("show");
        	
        }, show: function(v){
            return (v.status != constant.payment().paymentContract.STATUS_FILE_INT);
        }},
        {name: "客户签", clazz: "btn-warning", handle: function(v){
        	var decoration = {};
        	com.post(api.decoration.queryDecorationByOrderId, {"decorationOrderId": v.orderId}, function(res){
        		decoration = res.decoration;
        	}, null, false);
        	com.post(api.payment.signPaymentContractForCustomer, {"paymentContract.pcid" : v.pcid, "customer.cid" : decoration.customer.cid}, function (res) {
           	com.popup4frame("客户签", res.redirect);
           });
        }, show: function(v){
            return (v.status != constant.payment().paymentContract.STATUS_FILE_INT);
        }},
        {name: "已签", clazz: "btn-inverse", handle: function(v){
            com.post(api.payment.affixPaymentContract, {"paymentContract.pcid": v.pcid}, function(){
                com.showAlert(com.info, "已签");
                searcher.doSearch();
            });
                return false;
            }, show: function(v){
                return (v.status == constant.payment().paymentContract.STATUS_VALID_INT);
        }},
        {name: "失效", clazz: "btn-danger", handle: function(v){
        	com.post(api.payment.expirePaymentContract , {"paymentContract.pcid" : v.pcid}, function(){
        		com.showAlert(com.info, "失效");
                searcher.doSearch();
            });
                return false;
            }, show: function(v){
                return (v.status == constant.payment().paymentContract.STATUS_VALID_INT);
        }},
        {name: "归档", clazz: "btn-pink", handle: function(v){
        	com.post(api.payment.filingPaymentContract , {"paymentContract.pcid" : v.pcid}, function(){
        		com.showAlert(com.info, "归档");
                searcher.doSearch();
            });
                return false;
            }, show: function(v){
                return (v.status == constant.payment().paymentContract.STATUS_SIGN_INT);
        }},
        {name: "下载", clazz: "btn-purple", handle: function(v){
        	if(v.status == constant.payment().paymentContract.STATUS_FILE_INT) window.open(v.download);
            else com.popup("装修单: " + v.orderId + " 合同", config.media + v.path);
        }},
        {name: "二维查看", clazz: "btn-yellow", handle: function(v){
        	paymentContract.items.qrcode.html("").qrcode({
                render: "canvas",
                width: 150,
                height: 150,
                text: "http://www.fanglinserver.com/platform/" + "/views/contract/redirect.html?pcid=" + v.pcid + "&type=1&module=payment"
            });
            
            paymentContract.modals.qrcodeModal.modal('show');
        }, show: function(v){
            return (v.status != constant.payment().paymentContract.STATUS_FILE_INT);
        }},
        {name: "二维签名", clazz: "btn-success", handle: function(v){
        	 paymentContract.items.qrcode.html("").qrcode({
                 render: "canvas",
                 width: 150,
                 height: 150,
                 text: "http://www.fanglinserver.com/platform/" + "/views/contract/redirect.html?pcid=" + v.pcid + "&type=1&module=payment"
             });
             
        	 paymentContract.modals.qrcodeModal.modal('show');
        }, show: function(v){
            return (v.status != constant.payment().paymentContract.STATUS_FILE_INT);
        }},
        {name: "二维客签", clazz: "btn-warning", handle: function(v){
        	 paymentContract.items.qrcode.html("").qrcode({
                 render: "canvas",
                 width: 150,
                 height: 150,
                 text: "http://www.fanglinserver.com/platform/" + "/views/contract/redirect.html?pcid=" + v.pcid + "&type=2&module=payment"
             });
             
        	 paymentContract.modals.qrcodeModal.modal('show');
        }, show: function(v){
            return (v.status != constant.payment().paymentContract.STATUS_FILE_INT);
        }},
        {name: "签名通知", clazz: "btn-inverse", handle: function(v){
        	com.showConfirm("是否发送签章通知", function () {
                com.post(api.payment.sendPaymentContract, {"paymentContract.pcid" : v.pcid,"paymentContract.type" : 1});
            });
        }, show: function(v){
            return (v.status != constant.payment().paymentContract.STATUS_FILE_INT);
        }},
        {name: "客签通知", clazz: "btn-danger", handle: function(v){
        	com.showConfirm("是否发送签订通知", function () {
                com.post(api.payment.sendPaymentContract, {"paymentContract.pcid" : v.pcid,"paymentContract.type" : 2});
            });
        }, show: function(v){
            return (v.status != constant.payment().paymentContract.STATUS_FILE_INT);
        }},
        {name: "查看通知", clazz: "btn-pink", handle: function(v){
        	com.showConfirm("是否发送查看通知", function () {
                com.post(api.payment.sendPaymentContract, {"paymentContract.pcid" : v.pcid,"paymentContract.type" : 3});
            });
        }},
        {name: "下载通知", clazz: "btn-purple", handle: function(v){
        	com.showConfirm("是否发送下载通知", function () {
                com.post(api.payment.sendPaymentContract, {"paymentContract.pcid" : v.pcid,"paymentContract.type" : 4});
            });
        }, show: function(v){
            return (v.status != constant.payment().paymentContract.STATUS_FILE_INT);
        }}
    ];
  
    searcher.line("orderId", lineprops, linebtns).render(); 
    
    paymentContract.btns.signBtn.click(function (){
    	com.post(api.payment.signPaymentContractForCompany, {"paymentContract.pcid" : paymentContract.pcid, "signet.sid" : paymentContract.items.signet.val()}, function(){
    		com.showAlert(com.info, "操作成功");
    		searcher.doSearch();
        });
    	
        paymentContract.modals.paymentContractModal.modal("hide"); 
	});  
    
});