var customer = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	items: {},
	
	editFlag: false,
	repeatFlg: false,
};

jQuery(function($) {
	
	customer.saveBtn = $("#saveBtn").on("click", saveData);
	customer.cancelBtn = $("#cancelBtn");
	
	customer.modal = $("#customerModal").on('show.bs.modal', function(e){
		com.clearValidator();
		com.clearValidator("#phone", true);
	});
	
	customer.items.customerName = $("#customerName");
	customer.items.gender = $("#gender").switchBtn("gender");
	customer.items.phone = $("#phone").on("blur", function(){
		$this = $(this);
		if($this.val() == undefined || $this.val().trim() == ""){
			com.clearValidator("#phone", true);
			customer.repeatFlg = false;
			return;
		}
		if((com.validator.phones.regex).test($this.val())){
			com.post(api.data.checkCustomerForPhone, {"customer.phone":$this.val()}, function(res){
				var customerIds = res.customerIds;
				var count = customerIds.length;
				if(customer.editFlg){
					if(count == 1){
						if(customerIds[0] != customer.items.id){
							com.showTips($this, "该联系方式已存在", true);
							customer.repeatFlg = true;
						}else{
							com.clearValidator("#phone", true);
							customer.repeatFlg = false;
						}
							
					}else if(count > 1){
						com.showTips($this, "该联系方式已存在", true);
						customer.repeatFlg = true;
					}else{
						com.clearValidator("#phone", true);
						customer.repeatFlg = false;
					}
				}else{
					if(count > 0){
						com.showTips($this, "该联系方式已存在", true);
						customer.repeatFlg = true;
					}else{
						com.clearValidator("#phone", true);
						customer.repeatFlg = false;
					}
				}
			});
		}
	});
	customer.items.qq = $("#qq");
	customer.items.wechat = $("#wechat");
	customer.items.email = $("#email");
	customer.items.address = $("#address");
	customer.items.relationshipType = $("#relationshipType");
	
	com.post(api.ds.customerInfo, {}, function(res){
		
		var relationshipType = [];
		
		$.each(res.relationshipType, function(i, k){
			relationshipType.push(k.key);
		});
		
		customer.items.relationshipType.bindData(relationshipType);
	});
	
	var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = $('<li></li>').addClass('item-blue clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.phone));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                    
                    var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('编辑');

                    var propertyArr = [
                        ["姓名:", v.customerName, "grey"],
                        ["性别:", v.gender, "grey"],
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
                    	customer.items.id = v.id;
                    	editCustomer(v);
                    });
                    
                    $divBtnWrap.append($btnEdit).appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };
        
        var editCustomer = function (c){
        	customer.editFlg = true;
        	
			customer.items.id = c.id;
			customer.items.customerName.val(c.customerName);
			customer.items.phone.val(c.phone);
			customer.items.qq.val(c.qq);
			customer.items.wechat.val(c.wechat);
			customer.items.email.val(c.email);
			customer.items.address.val(c.address);
			customer.items.relationshipType.val(c.relationshipType);
			customer.items.gender.prop('checked', com.genderType[c.gender]);
			
			customer.modal.modal("show");
        };
        
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            }, initAddCustomer: function(){
            	$('a[name="add"]','#pagenation').click(function(){
            		customer.editFlg = false;
            		
        			com.cleanItems(customer.items);
        			
        			customer.modal.modal("show");
                });
            }
        }
    })();
	
	var searcher = new Searcher();
	
	searcher.init(['customerPhone', 'relationshipType'], "condList", api.data.pageCustomer, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "customerPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'add').css('margin', '5px 5px 0 0');
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });
	
	displayFunc.initAddCustomer();
	
	function saveData(){
		if(com.validate() || customer.repeatFlg){
			return;
		}
		
		var url;
		var options = {
			"customer.customerName": customer.items.customerName.val(),
			"customer.gender": com.genderType[customer.items.gender.prop("checked")],
			"customer.phone": customer.items.phone.val(),
			"customer.qq": customer.items.qq.val(),
			"customer.wechat": customer.items.wechat.val(),
			"customer.email": customer.items.email.val(),
			"customer.relationshipType": customer.items.relationshipType.val(),
			"customer.address": customer.items.address.val()
		};
		
		if(customer.editFlg){
			url = api.data.updateCustomer;
			options['customer.id'] = customer.items.id;
		}else {
			url = api.data.addCustomer;
			options['customer.approveStatus'] = 0;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		customer.modal.modal("hide");
	}
});

