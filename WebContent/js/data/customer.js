
jQuery(function($) {

	var customer = {
		
		btns: {
		    addPhoneBtn: com.focusPage("#addPhoneBtn"),
		    saveBtn: com.focusPage("#saveBtn"),
		},
		
		modals: {
		    customerModal: com.focusPage("#customerModal"),
		    
		},
		
		items: {
		    customerName: com.focusPage("#customerName"),
		    identity: com.focusPage("#identity"),
		    officer: com.focusPage("#officer"),
		    passport: com.focusPage("#passport"),
		    gender: com.focusPage("#gender"),
		    phone: com.focusPage("#phone"),
		    qq: com.focusPage("#qq"),
		    wechat: com.focusPage("#wechat"),
		    wechat: com.focusPage("#wechat"),
		    email: com.focusPage("#email"),
		    address: com.focusPage("#address"),
		    relationshipType: com.focusPage("#relationshipType"),
		    
		    addphone: com.focusPage("#addphone"),
		},
		
		cid: null,
	};
	
	customer.btns.saveBtn.on("click", saveData);
	customer.btns.addPhoneBtn.on("click", addPhone);
	
	customer.modal = com.focusPage("#customerModal").on('hide.bs.modal', function(e){
		com.clearValidator();
		com.cleanItems(customer.items);
	});

	com.post(api.ds.data, {}, function(res){
		customer.items.relationshipType.bindData(res.relationshipType, "key", "value");
	});
	
	var searcher = new Searcher();
	
	searcher.base("condList", "pagenation", "resultList", api.data.pageCustomer);
    
    searcher.condition(['customer-phone', 'customer-relationship']);
    
    searcher.history("customerPostData");
    
    searcher.button([{id: "add", name: "添加", clazz: "btn-success", icon: "icon-plus"}]);
    
    var lineprops = [
        {field: "name", name: "姓名", prop: "name", clazz: "grey"},
        {field: "gender", name: "性别", prop: "gender", clazz: "grey"},
        {field: "identity", name: "身份证号", prop: "identity", clazz: "grey"},
        {field: "officer", name: "军官证", prop: "officer", clazz: "grey"},
        {field: "passport", name: "护照", prop: "passport", clazz: "grey"},
        {field: "relationshipType", name: "客户关系", prop: "relationshipType", clazz: "red"},
        {field: "email", name: "邮箱", prop: "email", clazz: "grey"},
        {field: "qq", name: "QQ", prop: "qq", clazz: "grey"},
        {field: "wechat", name: "邮箱", prop: "wechat", clazz: "grey"},
        {field: "status", name: "状态", prop: function(v){return v.status == 0 ? "初始" : "认证"}, clazz: "red"},
    ];
    
    var linebtns = [
        {name: "编辑", clazz: "btn-yellow", handle: function(v){
            customer.cid = v.cid;
            editCustomer(v);
            return false;
        }},
        {name: "管理电话", clazz: "btn-success", handle: function(v){
            customer.cid = v.cid;
            customer.items.name = v.name;
            managephone();
            return false;
        }},
    ];
    
    searcher.line("name", lineprops, linebtns).render();
    
	com.focusPage('a[name="add"]','#pagenation').click(function(){
	    
	    customer.cid = null;
	    
        com.focusPage("#phonehide").css({"display":"block"});
        
        customer.modals.customerModal.modal("show");
    });
	
	function editCustomer(v){
        
        com.focusPage("#phonehide").css({"display":"none"});
        
        customer.items.customerName.val(v.name);
        customer.items.identity.val(v.identity);
        customer.items.officer.val(v.officer);
        customer.items.passport.val(v.passport) ;
        customer.items.qq.val(v.qq);
        customer.items.wechat.val(v.wechat);
        customer.items.email.val(v.email);
        customer.items.address.val(v.address);
        customer.items.relationshipType.val(v.relationshipType);
        customer.items.gender.prop('checked', com.genderType[v.gender]);
        
        customer.modals.customerModal.modal("show");
    };

	function saveData(){
	    
	    com.clearValidator();
	    
	    if(com.validate("customerModal")){
            return false;
        }
		
		var url;
		var options = {
			"customer.name": customer.items.customerName.val(),
			"customer.gender": com.genderType[customer.items.gender.prop("checked")],
			"customer.phone": customer.items.phone.val(),
			"customer.identity":customer.items.identity.val(),
			"customer.officer":customer.items.officer.val(),
			"customer.passport":customer.items.passport.val() ,
			"customer.qq": customer.items.qq.val(),
			"customer.wechat": customer.items.wechat.val(),
			"customer.email": customer.items.email.val(),
			"customer.relationshipType": customer.items.relationshipType.val(),
			"customer.address": customer.items.address.val()
		};
		
		if(customer.cid){
			url = api.data.updateCustomer;
			options['customer.cid'] = customer.cid;
		}else {
			url = api.data.addCustomer;
			
			if(checkPhone(null, com.focusPage("#phone"), 1)){
	            return false;
	        }
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		customer.modal.modal("hide");
	}

	//画电话的弹窗
	function managephone() {
	    
        com.focusPage('#customerphoneList').empty();
        
		customer.items.addphone.css("border", "1px solid #d5d5d5").popover("destroy").val("");
		
		com.post(api.data.queryCustomerPhoneByCid, {"customerPhone.cid": customer.cid}, function (res) {
		    
            com.focusPage('#customerphoneModal').modal('show');
            
			$.each(res.customerPhones, function (i, v) {

				var phonelist = $('<div></div>').prop("id", "customerPhone" + i);
				phonelist.append(addspan('10', '客户姓名 : ', customer.items.name)).append(addspan('40', '电话号码  : ', v.phone));

				var $btnStatus =$('<div style="float: right;"></div>')
				var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"}).attr("id", v.cpid);
				var $span = $('<span></span>').addClass('lbl status-lbl');

				var $btnDefault =$('<div style="float: right;"></div>')
				var $defaultSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"}).attr("id", v.cpid);
				var $dspan = $('<span></span>').addClass('lbl default-lbl');

				var $hr= $('<hr/>');

				!v.status && $statusSwitch.prop("checked", true);
				
				$statusSwitch.on("click",function() {
					if($statusSwitch.prop("checked")){
						var option={
							"customerPhone.phone":v.phone,
							"customerPhone.status":0,
						}
						//先查询该电话是否被被人启用
                         com.post(api.data.checkCustomerForPhone,option,function(res){
							 updateStatus(v.cpid, 0, function(){$statusSwitch.prop("checked", false);})
						 },function(res){
							 com.showAlert(com.warning, "该电话已经被其他客户启用");
							 $statusSwitch.prop("checked", false);
						 },false);
					}else{
						 if(v.defaults == 1){
							 com.showAlert(com.warning, "默认电话不能禁用");
							 $statusSwitch.prop("checked", true);
						 }else{
							 updateStatus(v.cpid, 1,function(){ $statusSwitch.prop("checked", true);})
						 }
						}
				})

				v.defaults && $defaultSwitch.prop("checked", true);
				$defaultSwitch.on("click",function() {
					if($defaultSwitch.prop("checked")){
						if(v.status == 1){
							$defaultSwitch.prop("checked", false);
							com.showAlert(com.warning, "禁用电话不能选为默认电话");
						}else{
							updateDefault(v.cpid, 1,function(){$this.prop("checked")})
						 }
					}else{
						$defaultSwitch.prop("checked", true);
					}
				});

				$btnDefault.append($defaultSwitch).append($dspan);
				$btnStatus.append($statusSwitch).append($span);
				phonelist.append($btnDefault).append($btnStatus).append($hr).appendTo(com.focusPage("#customerphoneList"))
			});

		}, null, false)
	}

	function addspan(px, name, value) {
	    
		var $pxdiv = $('<div></div>').css({
			'display' : 'inline-block',
			'margin-left' : px + 'px'
		});
		
		var $nameSpan = $('<strong></strong>').html(name);
		var $valueSpan = $('<b></b>').text(value);
		
		var $blueb = $valueSpan.addClass("grey");
		
        return $pxdiv.append($nameSpan).append($blueb);
	}

	function addPhone(){
		
		if(checkPhone(customer.cid, customer.items.addphone)){
		    return false;
		};
		
		var param={
			"customerPhone.phone": customer.items.addphone.val(),
			"customerPhone.cid": customer.cid,
		}
		
		com.post(api.data.addCustomerPhone, param,function(res){
			managephone();
		});
	}

	// 启用禁用功能
	function updateStatus(cpid, status, failcallBack){
		com.post(api.data.updateCustomerPhoneForStatus, {"customerPhone.cpid":cpid,"customerPhone.status" : status}, function(res){
			managephone();
		}, function(res){
			failcallBack && failcallBack();
		});
	}
	
	// 客户电话是否是默认的
	function updateDefault(cpid, defaults, failcallBack){
		com.post(api.data.updateCustomerPhoneForDefault, {"customerPhone.cpid":cpid,"customerPhone.defaults" : defaults}, function(){
			managephone();
		},function(res){
			failcallBack && failcallBack();
		});
	}
	
	function checkPhone(cid, ele) {
	    
	    var flag = false;
	    
	    com.post(api.data.checkCustomerForPhone,{"customerPhone.cid" :cid, "customerPhone.phone": ele.val(), "customerPhone.status": null}, function(res) {
	        ele.css("border", "1px solid #d5d5d5").popover("destroy");
        }, function(res){
            flag = true;
            com.showPopover(ele, {errorMsg: "电话信息已存在"}, "right");
        }, false);
	    
	    return flag;
	}

});

