var userAdvance = {
	postData: {},
	postParam: {},
	
	userAdvanceItems: {},
}

jQuery(function($) {
	
	userAdvance.userAdvanceModal = $("#userAdvanceModal");
	
	userAdvance.userAdvanceItems.isLogin = $("#isLogin").switchBtn("isOrNot");
	userAdvance.userAdvanceItems.extranet = $("#extranet").switchBtn("isOrNot");
	userAdvance.userAdvanceItems.roleSel = $("#roleSel");
	userAdvance.userAdvanceItems.company = $("#company");
	
	userAdvance.userAdvanceItems.advanceSaveBtn = $("#advanceSaveBtn").on("click", saveData);
	userAdvance.userAdvanceItems.advanceCancelBtn = $("#advanceCancelBtn");
	
	com.post(api.ds.departmentInfo, {"timestamp": new Date().getTime()}, function(res){
		userAdvance.deptType = res.deptType;
	}, null, false);
	
	com.post(api.ds.companyType, {"timestamp": new Date().getTime()}, function(res){
		userAdvance.company = res.company;
	}, null, false);
	
	com.post(api.system.queryRole, {"timestamp": new Date().getTime()}, function(res){
		userAdvance.roleList = res.roleList;
	}, null, false);
	
	var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = $('<li></li>').addClass('item-blue clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.userName));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var $btnRight = $('<a></a>').addClass('btn btn-minier btn-primary').html('权配');

					var $btnDesigne = $('<a></a>').addClass('btn btn-minier btn-danger').html('订单设计')
					var $btnSales = $('<a></a>').addClass('btn btn-minier btn-inverse').html('订单业务')
					var $btnStatus = $('<a></a>').addClass('btn btn-minier btn-pink').html('订单状态')
                    var propertyArr = [
                        ["员工编号:", v.userId, "grey"],
                        ["用户名:", v.loginId, "grey"],
                        ["部门:", v.dept.deptName, "grey"],
                        ["职位:", v.duty, "grey"],
                        ["角色:", v.role.roleName, "grey"],
                        ["联系方式:", v.phone, "grey"]
                     ];

                    $.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
                    });

                    $btnRight.click(function(){
                    	dialogUserAdvanceIndex(v.userId);
                    });

					$btnDesigne.click(function(){
						binding.openDesignDialog(v.userId);
					});

					$btnSales.click(function(){
						binding.openSalesDialog(v.userId);
					});

					$btnStatus.click(function(){
						binding.openOrderDialog(v.userId);
					});

					$divBtnWrap.append($btnRight).append($btnDesigne).append($btnSales).append($btnStatus).appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

		var binding = {
			$dialog : $('#listModal'),
			postConf : {
				"user.userId" : null,
				path : null,
				name : null
			},
			//设计权限配置
			openDesignDialog : function(userId){
				var $dialog = this.$dialog;
				var list = [{did: -1, deptName: "全部"}], userList;
				var $list = $('.modal-body', $dialog);
				$list.empty();
				com.post(api.department.queryDepartment, { "dept.type" : "设计部"}, function(data){
					list = list.concat(data.deptList);
				}, null, false);
				com.post(api.right.queryDecorationOrderDesignDepartmentRightByUserId, { "user.userId" : userId}, function(data){
					userList = data.dids;
				}, null, false);

				list && list.length && $.each(list, function(i, v){
					var $label = $('<label  style="margin-right:20px;display: inline-block;min-width: 25%;"></label>');
					var $input = $('<input>').attr({
						"type" : "checkbox",
						"name" : "advance",
						"class" : "ace",
					}).val(v.did);
					var $span = $('<span></span>').addClass('lbl').html(v.deptName);
					$label.append($input).append($span).appendTo($list);
				});

				userList && userList.length && $.each(userList, function(i, v){
					$('input[name="advance"][value="'+ v +'"]', $list).prop('checked',true);
				});

				$dialog.modal("show");

				this.postConf.path = api.right.updateDecorationOrderDesignDepartmentRight;
				this.postConf.name = "dids";
				this.postConf["user.userId"] = userId;
			},
			//业务权限配置
			openSalesDialog : function(userId){
				var $dialog = this.$dialog;
				var list = [{did: -1, deptName: "全部"}], userList;
				var $list = $('.modal-body', $dialog);
				$list.empty();
				com.post(api.department.queryDepartment, { "dept.type" : "业务部"}, function(data){
					list = list.concat(data.deptList);
					list.push();
				}, null, false);
				com.post(api.right.queryDecorationOrderSalesmanDepartmentRightByUserId, { "user.userId" : userId}, function(data){
					userList = data.dids;
				}, null, false);

				list && list.length && $.each(list, function(i, v){
					var $label = $('<label  style="margin-right:20px;display: inline-block;min-width: 25%;"></label>');
					var $input = $('<input>').attr({
						"type" : "checkbox",
						"name" : "advance",
						"class" : "ace",
					}).val(v.did);
					var $span = $('<span></span>').addClass('lbl').html(v.deptName);
					$label.append($input).append($span).appendTo($list);
				});

				userList && userList.length && $.each(userList, function(i, v){
					$('input[name="advance"][value="'+ v +'"]', $list).prop('checked',true);
				});

				$dialog.modal("show");

				this.postConf.path = api.right.updateDecorationOrderSalesmanDepartmentRight;
				this.postConf.name = "dids";
				this.postConf["user.userId"] = userId;
			},
			//订单权限配置
			openOrderDialog : function(userId){
				var $dialog = this.$dialog;
				var list=[{key: "全部", value: "全部"}], userList;
				var $list = $('.modal-body', $dialog);
				$list.empty();
				com.post(api.ds.decorationInfo, {}, function(data){
					list = list.concat(data.decorationOrderStatus);
				}, null, false);
				com.post(api.right.queryDecorationOrderStatusRightByUserId, { "user.userId" : userId}, function(data){
					userList = data.statuses;
				}, null, false);

				list && list.length && $.each(list, function(i, v){
					var $label = $('<label  style="margin-right:20px;display: inline-block;min-width: 25%;"></label>');
					var $input = $('<input>').attr({
						"type" : "checkbox",
						"name" : "advance",
						"class" : "ace",
					}).val(v.key);
					var $span = $('<span></span>').addClass('lbl').html(v.value);
					$label.append($input).append($span).appendTo($list);
				});

				userList && userList.length && $.each(userList, function(i, v){
					$('input[name="advance"][value="'+ v +'"]', $list).prop('checked',true);
				});

				$dialog.modal("show");

				this.postConf.path = api.right.updateDecorationOrderStatusRight;
				this.postConf.name = "statuses";
				this.postConf["user.userId"] = userId;

			},
			setAdvance : function(){
				var $dialog = this.$dialog;
				var postConf = this.postConf;
				
				$('button[name="subbtn"]').click(function(){
					var list = $('input[name="advance"]:checked', $dialog);
					var params = {"user.userId" : postConf["user.userId"]};
					
					list.length && (
						$.each(list, function(i, v){
							var $v = $(this).val();
							params[postConf.name + "[" + i + "]"] = $v;
							if($v == -1 || $v == '全部') return false;
						}),
						com.post(postConf.path, params, function(data){
							$dialog.modal("hide");
						})
					);
				});
			}
		};

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            }, setAdvance: function(){
            	binding.setAdvance();
            }
        }
    })();
	
	var _condArr = ['userId', 'userName', 'roleId', 'deptType', 'deptId'];

	var userAdvanceSeacher = new Searcher();
	
	userAdvanceSeacher.init( _condArr, "condList", api.personel.pageUser, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "userAdvancePostData");
	
	displayFunc.setAdvance();
});

function dialogUserAdvanceIndex(userId, userName){
	
	userAdvance.postData.userId = userId;
	
	var options = {
		"user.userId": userId,
	}
	
	com.post(api.personel.queryUserByUserId, options, function(res){
		
		var user = res.user;
		
		userAdvance.userAdvanceItems.company.bindData(userAdvance.company, "key", "value");
		userAdvance.userAdvanceItems.roleSel.bindData(userAdvance.roleList, "roleId", "roleName");
		
		userAdvance.userAdvanceItems.isLogin.prop("checked", (user.isLogin & 1) == 1 ? true : false);
		userAdvance.userAdvanceItems.extranet.prop("checked", user.extranet == 1 ? true : false);
		userAdvance.userAdvanceItems.company.val(user.company);
		userAdvance.userAdvanceItems.roleSel.val(user.role.roleId);
		
		userAdvance.userAdvanceModal.modal("show");
	}, null, false);
}

function saveData(){
	
	var options = {
		"user.userId": userAdvance.postData.userId,
		"user.isLogin": userAdvance.userAdvanceItems.isLogin.prop("checked") ? 1 : -1,
		"user.extranet": userAdvance.userAdvanceItems.extranet.prop("checked") ? 1 : 0,
		"user.role.roleId": userAdvance.userAdvanceItems.roleSel.val(),
		"user.company": userAdvance.userAdvanceItems.company.val(),
	}
	
	com.post(api.personel.updateUserForAdvance, options, function(res){
		com.showAlert(com.info, "提交成功");
	});
	
	userAdvance.userAdvanceModal.modal("hide");
	
	return false;
}