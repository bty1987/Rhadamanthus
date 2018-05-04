
jQuery(function($) {

	var customer = {
		relationshipType:[],
		saveBtn: null,
		cancellBtn: null,
		modal: null,
		items: {},
		editFlg:false,//添加/更新客户
		phoneflag :true,//管理电话的flag
		repeatFlg: false,//添加客户是电话的flag
	};
	
	customer.saveBtn = $("#saveBtn").on("click", saveData);
	customer.cancelBtn = $("#cancelBtn");
	customer.phonesaveBtn = $("#phonesaveBtn").on("click", savecustomerPhone);
	customer.modal = $("#customerModal").on('show.bs.modal', function(e){
		com.clearValidator();
		com.clearValidator("#phone", true);
	});

	customer.items.customerName = $("#customerName");
	customer.items.identity = $("#identity");
	customer.items.officer = $("#officer");
	customer.items.passport = $("#passport");
	customer.items.gender = $("#gender").switchBtn("gender");
	customer.items.phone = $("#phone").on("blur",function(){checkPhone(null,$("#phone"),1)});
	customer.items.addphone = $("#addphone");
	customer.items.qq = $("#qq");
	customer.items.wechat = $("#wechat");
	customer.items.email = $("#email");
	customer.items.address = $("#address");
	customer.items.relationshipType = $("#relationshipType");
	
	com.post(api.ds.data, {}, function(res){
		$.each(res.relationshipType, function(i, k){
			customer.relationshipType.push(k.key);
		});
		customer.items.relationshipType.bindData(customer.relationshipType);

	},null,false);
	
	var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
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
                    	customer.items.cid = v.cid;
                    	editCustomer(v);
                    });

					$managephone.click(function(){
						customer.items.cid = v.cid;
						customer.items.name = v.name;
						managephone();
					});

                    $divBtnWrap.append($btnEdit).append($managephone).appendTo($h3);
                    $liLine.append($h3).append($ulProperty).appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };
        
        var editCustomer = function (c){
			customer.modal.modal("show");
        	customer.editFlg = true;
			$("#phonehide").css({"display":"none"});
			customer.repeatFlg = false
			customer.items.cid = c.cid;
			customer.items.customerName.val(c.name);
			customer.items.identity.val(c.identity);
			customer.items.officer.val(c.officer);
			customer.items.passport.val(c.passport) ;
			customer.items.qq.val(c.qq);
			customer.items.wechat.val(c.wechat);
			customer.items.email.val(c.email);
			customer.items.address.val(c.address);
			customer.items.relationshipType.val(c.relationshipType);
			customer.items.gender.prop('checked', com.genderType[c.gender]);

        };
        
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            }, initAddCustomer: function(){
            	$('a[name="add"]','#pagenation').click(function(){
            		customer.editFlg = false;
					initcustomer()
					$("#phonehide").css({"display":"block"});
        			customer.modal.modal("show");
                });
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
	
	displayFunc.initAddCustomer();

	function saveData(){
		com.clearValidator();
		if(com.validate() || customer.repeatFlg ){
			if(customer.editFlg == false){
				checkPhone(null,$("#phone"),1)
			}
			return;
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
		if(customer.editFlg){
			url = api.data.updateCustomer;
			options['customer.cid'] = customer.items.cid;
		}else {
			url = api.data.addCustomer;
		}
		com.post(url, options, function(res){
			searcher.doSearch();
			initcustomer()

		});
		
		customer.modal.modal("hide");
	}

	//画电话的弹窗
	function managephone() {
		if ($('#customerphoneList').children()) {
			$('#customerphoneList').empty();
		}
		customer.phoneflag =true;
		$("#addphone").css("border", "1px solid #d5d5d5").popover("destroy");
		customer.items.addphone.val("");
		com.post(api.data.queryCustomerPhoneByCid, {"customerPhone.cid": customer.items.cid}, function (res) {
			$('#customerphoneModal').modal('show');
			$.each(res.customerPhones, function (i, v) {

				var Phonelist = $('<div></div>').prop("id", "customerPhone" + i);
				Phonelist.append(addspan('10', '客户姓名  : ', customer.items.name))
					.append(addspan('40', '电话号码  : ', v.phone));

				var $btnStatus =$('<div style="float: right;"></div>')
				var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"}).attr("id", "deleteBtn" + i);
				var $span = $('<span></span>').addClass('lbl status-lbl');

				var $btnDStatus =$('<div style="float: right;"></div>')
				var $DstatusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"}).attr("id", "deleteBtn" + i);
				var $Dspan = $('<span></span>').addClass('lbl default-lbl');

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
							 updateCustomerPhoneForStatus(v.phone, 0, function(){$this.removeAttr("checked")})
						 },function(res){
							 com.showAlert(com.warning, "该电话已经被其他客户启用");
							 $statusSwitch.prop("checked", false);
						 },false);
					}else{
						 if(v.defaults == 1){
							 com.showAlert(com.warning, "默认电话不能禁用");
							 $statusSwitch.prop("checked", true);
						 }else{
							 updateCustomerPhoneForStatus(v.phone, 1,function(){$this.prop("checked")})
						 }
						}
				})

				v.defaults && $DstatusSwitch.prop("checked", true);
				$DstatusSwitch.on("click",function() {
					if($DstatusSwitch.prop("checked")){
						if(v.status==1){
							$DstatusSwitch.prop("checked", false);
							com.showAlert(com.warning, "禁用电话不能选为默认电话");
						}else{
							updateCustomerPhoneForDstatus(v.phone, 1,function(){$this.prop("checked")})
						 }
					}else{
						$DstatusSwitch.prop("checked", true);
					}
				});

				$btnDStatus.append($DstatusSwitch).append($Dspan);
				$btnStatus.append($statusSwitch).append($span);
				Phonelist.append($btnDStatus).append($btnStatus).append($hr).appendTo($("#customerphoneList"))
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

	function savecustomerPhone(){
		
		checkPhone(customer.items.cid,$("#addphone"),0);
		
		if(customer.phoneflag){
			return;
		}
		
		var param={
			"customerPhone.phone":customer.items.addphone.val(),
			"customerPhone.cid":customer.items.cid,
		}
		
		com.post(api.data.addCustomerPhone, param,function(res){
			managephone();
		});
	}

	//启用禁用功能
	function updateCustomerPhoneForStatus(phone, status, failcallBack){
		com.post(api.data.updateCustomerPhoneForStatus, {"customerPhone.cid":customer.items.cid,"customerPhone.phone" : phone,"customerPhone.status" : status}, function(){
			managephone()
		},function(res){
			failcallBack && failcallBack();
		},null,false);
	}
  //客户电话是否是默认的
	function updateCustomerPhoneForDstatus(phone, defaults, failcallBack){
		com.post(api.data.updateCustomerPhoneForDstatus, {"customerPhone.cid":customer.items.cid,"customerPhone.phone" : phone,"customerPhone.defaults" : defaults}, function(){
			managephone()
		},function(res){
			failcallBack && failcallBack();
		},null,false);
	}
	//清空
	function initcustomer(){
		customer.items.customerName.val("");
		customer.items.gender.get(0).selectedIndex = 0
		customer.items.qq.val("");
		customer.items.wechat.val("");
		customer.items.email.val("");
		customer.items.identity.val("");
		customer.items.officer.val("");
		customer.items.passport.val("");
		customer.items.relationshipType.get(0).selectedIndex = 0
		customer.items.address.val("");
		customer.items.phone.val("");
		com.clearValidator();

	}

	function checkPhone(cid,$id,num) {
		var reg = /^((1[0-9]{10})|(0[0-9]{10}))((#((1[0-9]{10})|(0[0-9]{10})))){0,4}$/;
		if ($id.val() == "" || $id.val() == 0) {
			num ? customer.repeatFlg = true : customer.phoneflag = true;
			com.showPopover($id, {errorMsg: "电话号码不能为空"}, "bottom")
		} else {
			if (reg.test($id.val()) == false) {
				num ? customer.repeatFlg =  true : customer.phoneflag = true;
				com.showPopover($id, {errorMsg: "请输入正确的手机号或固定电话!!"}, "bottom");

			} else {
				com.post(api.data.checkCustomerForPhone,{"customerPhone.cid" :cid,"customerPhone.phone": $id.val(), "customerPhone.status":null}, function(res) {
					num ? customer.repeatFlg = true : customer.phoneflag = true;
					com.showPopover($id,{errorMsg: "电话信息已存在"}, "bottom");
				}, function(res){
					num ? customer.repeatFlg = false : customer.phoneflag = false;
					$id.css("border", "1px solid #d5d5d5").popover("destroy");
				}, false);
			}
		}
	}

});

