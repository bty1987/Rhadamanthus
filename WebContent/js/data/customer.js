
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
	
	var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                    var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
					var $managephone = $('<a></a>').addClass('btn btn-minier btn-success').html('管理电话');

                    var propertyArr = [
                        ["姓名:", v.name, "grey"],
                        ["性别:", v.gender, "grey"],
						["身份证号:", v.identity, "grey"],
						["军官证:", v.officer, "grey"],
						["护照:", v.passport, "grey"],
                        ["客户关系:", v.relationshipType, "grey"],
                        ["邮箱:", v.email, "grey"],
                        ["QQ:", v.qq, "grey"],
                        ["微信:", v.wechat, "grey"]
                     ];

                    $.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});
                    
                    $btnEdit.click(function(){
                    	customer.cid = v.cid;
                    	editCustomer(v);
                    });

					$managephone.click(function(){
						customer.cid = v.cid;
						customer.items.name = v.name;
						managephone();
					});

                    $divBtnWrap.append($btnEdit).append($managephone).appendTo($h3);
                    $liLine.append($h3).append($ulProperty).appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };
        
        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            }, initAddCustomer: function(){
                
            }
        }
    })();

	var searcher = new Searcher();
	
	searcher.init([ 'customerPhone','relationshipType'], "condList", api.data.pageCustomer, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "customerPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'add').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });
	
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
				phonelist.append(addspan('10', '客户姓名  : ', customer.items.name)).append(addspan('40', '电话号码  : ', v.phone));

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
		var $10pxdiv = $('<div></div>').css({
			'display' : 'inline-block',
			'margin-left' : '10px'
		});
		var $40pxdiv = $('<div></div>').css({
			'display' : 'inline-block',
			'margin-left' : '40px'
		});
		var $nameSpan = $('<strong></strong>').html(name);
		var $valueSpan = $('<b></b>').text(value);

		if (px == '40') {
			var $blueb = $valueSpan.addClass("grey")
			return $40pxdiv.append($nameSpan).append($blueb);
		} else if (px == '10') {
			var $greyb = $valueSpan.addClass("grey")
			return $10pxdiv.append($nameSpan).append($greyb);
		}
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

