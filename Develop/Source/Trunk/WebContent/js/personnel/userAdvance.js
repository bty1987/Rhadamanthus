var userAdvance = {
	postData: {},
	postParam: {},
	userAdvanceItems: {},


}
var $wrap=null;

jQuery(function($) {

	function showDepaermentModal() {
		 $wrap = $('#moduleModal').find('.modal-body').empty();
		com.post(api.department.queryDepartment, {"dept.type": "all"}, function (res) {
			var treeData = res.deptList;
			if (!treeData || !treeData.length) {
				return;
			}
			var menuArr = {
				level1 : [],
				level2 : [],
				level3 : [],
			};
			var menuObj = {
				level1:{},
				level2 : {},
				level3 : {},
			};
			var $tree = $('<ol class="dd-list"></ol>');
			$wrap.append($tree);
			menuArr.level1=[{did: -1, deptName: "全部"}];
			$.each(treeData,function(i,va){
				if(va.fatherDept == null){
					menuArr.level2.push(va)
				}
			})

			$.each(menuArr.level2,function(i,va){
				$.each(treeData,function(index,value){
					if(value.fatherDept != null) {
						if (value.fatherDept.deptId == va.deptId) {
							menuArr.level3.push(value)
						}
					}
				})
			})

			if (menuArr.level1.length) {
				$.each(menuArr.level1, function (i, va) {
					var $li = $('<li></li>').addClass('dd-item');
					var $div = $('<div></div>').addClass('dd-handle clearfix').text(va.deptName);
					var $input = $('<input>').attr({type: 'checkbox', name: 'module'}).addClass('ace').val(va.did);
					var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({'margin-bottom': '0', 'margin-top': '-5px'});
					var $label = $('<label></label>').append($input).append('<span class="lbl"></span>');
					$indexCheck.append($label).appendTo($div);
					$li.append($div).appendTo($tree);
					menuObj.level1[va.did] = $li;
				});
			}

			if (menuArr.level2.length) {
				$.each(menuArr.level2, function (i, va) {
					var $li = $('<li></li>').addClass('dd-item');
					var $div = $('<div></div>').addClass('dd-handle clearfix').text(va.deptName);
					var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({'margin-bottom': '0', 'margin-top': '-5px'});
					var $label = $('<label></label>').append('<span class="lbl"></span>');
					$indexCheck.append($label).appendTo($div);
					menuObj.level2[va.did] = $li;
					$li.append($div);

					var $parent = menuObj.level1[-1]
					$parent.children('div').hasClass('btn-default') || $parent.children('div').addClass('btn-default');
					if (!$parent.children('button').length) {
						var $title = $parent.children('div');
						$('<button type="button" data-action="collapse" class="minus">Collapse</button>').insertBefore($title);
						$('<button type="button" data-action="expand" class="hide plus">Expand</button>').insertBefore($title);
					}

					var $pol = $parent.children('ol').length ? $parent.children('ol') : $('<ol></ol>').addClass('dd-list hide').appendTo($parent);
					$li.appendTo($pol);
				});
			}

			if (menuArr.level3.length) {
				$.each(menuArr.level3, function (i, va) {
						var $li = $('<li></li>').addClass('dd-item');
						var $div = $('<div></div>').addClass('dd-handle clearfix').text(va.deptName);
						var $input = $('<input>').attr({type: 'checkbox', name: 'module'}).addClass('ace').val(va.did)
						var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({'margin-bottom': '0', 'margin-top': '-5px'});
						var $label = $('<label></label>').append($input).append('<span class="lbl"></span>');
						$indexCheck.append($label).appendTo($div);
						menuObj.level3[va.did] = $li;
						$li.append($div);

						var $parent = menuObj.level2[va.fatherDept.did];
						$parent.children('div').hasClass('btn-default') || $parent.children('div').addClass('btn-default');
						if (!$parent.children('button').length) {
							var $title = $parent.children('div');
							$('<button type="button" data-action="collapse" class="minus">Collapse</button>').insertBefore($title);
							$('<button type="button" data-action="expand" class="hide plus">Expand</button>').insertBefore($title);
						}

						var $pol = $parent.children('ol').length ? $parent.children('ol') : $('<ol></ol>').addClass('dd-list hide').appendTo($parent);
						$li.appendTo($pol);
				});
			}
			$('button[data-action="collapse"]').click(function () {
				var $this = $(this);
				$this.siblings('ol').addClass('hide');
				$this.parent().find('.plus').toggleClass('hide');
				$this.toggleClass('hide');
			});

			$('button[data-action="expand"]').click(function () {
				var $this = $(this);
				$this.siblings('ol').removeClass('hide');
				$this.parent().find('.minus').toggleClass('hide');
				$this.toggleClass('hide');
			});

		}, null, false);

	}

	userAdvance.userAdvanceModal = $("#userAdvanceModal");
	userAdvance.userCompanyModal=$("#companyModal");

	userAdvance.userAdvanceItems.isLogin = $("#isLogin").switchBtn("isOrNot");
	userAdvance.userAdvanceItems.extranet = $("#extranet").switchBtn("isOrNot");
	userAdvance.userAdvanceItems.roleSel = $("#roleSel");
	userAdvance.userAdvanceItems.company = $("#company");

	userAdvance.userAdvanceItems.companysel = $("#companysel").chosen({
		width: "216px"
	});

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

	com.post(api.system.queryCompany,{},function(res){
		userAdvance.companysel = res.companys;
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

					var $company = $('<a></a>').addClass('btn btn-minier btn-yellow').html('公司');
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

					$company.unbind().bind('click',function(){

						userAdvance.userAdvanceItems.companysel.bindData(userAdvance.companysel , "cid", "name");
						userAdvance.userCompanyModal.modal("show");
						var options = {
								"user.uid": v.uid,
							}
						var userCompanys={};
						var cids=[];
						com.post(api.personel.queryUserCompany, options, function(res){
								userCompanys = res.userCompanys;
								$.each(userCompanys,function(i,va){
									cids.push(va.cid);
								});
							}, null, false);
						userAdvance.userAdvanceItems.companysel.trigger("chosen:updated");
						$.each(cids,
							function(i,val) {
								$("[value\x3d'" + val + "']", userAdvance.userAdvanceItems.companysel).attr("selected", "selected")
							});
						userAdvance.userAdvanceItems.companysel.trigger("chosen:updated");

						$('button[name="saveCompanyBtn"]').unbind().bind('click',function(){
							var newcids=[];
							userAdvance.userCompanyModal.modal("hide");
							var params={
								"user.uid": v.uid,
							}
							if(userAdvance.userAdvanceItems.companysel.val() != null){
							  $.each(userAdvance.userAdvanceItems.companysel.val().splice(','),function(i,value){
								newcids.push(value)
								});

								$.each(newcids, function(i, val){
									params["cids" + "[" + i + "]"] = val;
								});
								com.post(api.personel.updateUserCompany, params,function (res) {
								},null,false)
						}else{
								params["cids"]=[];
								com.post(api.personel.updateUserCompany, params,function (res) {
								},null,false)
							}


						  });
						});

					$btnRight.click(function(){
						dialogUserAdvanceIndex(v.userId);
					});

					$btnDesigne.click(function() {
						binding.openDesignDialog(v.userId);
					});

					$btnSales.unbind().bind('click',function(){
						binding.openSalesDialog(v.userId);
					});

					$btnStatus.click(function(){
						binding.openOrderDialog(v.userId);
					});

					$divBtnWrap.append($company).append($btnRight).append($btnDesigne).append($btnSales).append($btnStatus).appendTo($h3);

					$liLine.append($h3).append($ulProperty).appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		};

		var binding = {
			$dialog : $('#moduleModal'),
			postConf : {
				"user.userId" : null,
				path : null,
				name : null
			},
			//设计权限配置
			openDesignDialog : function(userId){
				var $dialog = this.$dialog;
				showDepaermentModal();
				com.post(api.right.queryDecorationOrderDesignDepartmentRightByUserId, { "user.userId" :  userId}, function(data){
					if(data.dids.length){
						$.each(data.dids, function(i, v){
							$wrap.find('input[value="'+ v +'"]').prop('checked', true);
						});
					}
				}, null, false);
				$dialog.modal("show");
				this.postConf.path = api.right.updateDecorationOrderDesignDepartmentRight;
				this.postConf.name = "dids";
				this.postConf["user.userId"] = userId;
			},
			//业务权限配置
			openSalesDialog : function(userId) {
				var $dialog = this.$dialog;
				showDepaermentModal();
				com.post(api.right.queryDecorationOrderSalesmanDepartmentRightByUserId, { "user.userId" :  userId}, function(data){
					if(data.dids.length){
						$.each(data.dids, function(i, v){
							$wrap.find('input[value="'+ v +'"]').prop('checked', true);
						});
					}
				}, null, false);
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
						"name" : "module",
						"class" : "ace",
					}).val(v.key);
					var $span = $('<span></span>').addClass('lbl').html(v.value);
					$label.append($input).append($span).appendTo($list);
				});

				userList && userList.length && $.each(userList, function(i, v){
					$('input[name="module"][value="'+ v +'"]', $list).prop('checked',true);
				});

				$dialog.modal("show");

				this.postConf.path = api.right.updateDecorationOrderStatusRight;
				this.postConf.name = "statuses";
				this.postConf["user.userId"] = userId;

			},
			setAdvance : function(){
				var $dialog = this.$dialog;
				var postConf = this.postConf;

				$('button[name="saveBtn"]').click(function(){
					var list = $('input[name="module"]:checked', $dialog);

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

function dialogUserAdvanceIndex(userId){
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

