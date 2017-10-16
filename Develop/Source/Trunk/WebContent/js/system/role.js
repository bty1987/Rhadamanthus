
jQuery(function($) {
	
	var role = {
		saveBtn: null,
		operationSaveBtn: null,
		moduleSaveBtn: null,
		cancelBtn: null,
		modal: null,
		operationModal : null,
		moduleModal : null,
		roleItems: {},
		
		validator: {
			roleId: {
				type: "v_roleId", 
				regex: /^[\w-_]+$/,
				errorMsg: "请输入数字字母或下划线中划线."
			}
		},
		
		postParam: {},
		
		editFlg: false,
		repeatFlg: false
	};

	var setting = {
		check: {
			enable: true,
			chkDisabledInherit: true,
			chkboxType: { "Y": "s", "N": "ps" }
		}, data: {
			simpleData: {
				enable: true
			}
		}
	};
	
	role.saveBtn = $("#saveBtn").on("click", saveData);
	role.operationSaveBtn = $('#operationModal').find(' button[name="saveBtn"]').on("click", saveOperation);
	role.moduleSaveBtn = $('#moduleModal').find(' button[name="saveBtn"]').on("click", saveModule);
	role.cancelBtn = $("#cancelBtn");
	role.modal = $("#roleModal");
	role.operationModal = $("#operationModal");
	role.moduleModal = $("#moduleModal");
	role.roleItems.roleId = $("#roleId");
	role.roleItems.roleDes = $("#roleDes");
	role.roleItems.roleName = $("#roleName");
	role.chainPageModal = $("#chainPageModal");
	role.roleItems.currentchainPage = $("#currentchainPage");
	role.roleItems.chainPage = $("#chainPage").chosen({
		width: "200px"
	});

	role.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#roleName", true);
		com.clearValidator("#roleId", true);
	});
	
	$.extend(com.validator, role.validator);
	
	$("#cancelRoleRightBtn").on("click",goBackRoleList);
	$("#saveRoleRightBtn").on("click",saveRoleRight);

	function queryOperationByRoleId(roleId){
		var $wrap = $('#operationModal').find('.modal-body').empty();
		//获取全部操作
		com.post(api.system.queryOperation, {'operation.system' : 1}, function(data){

			if(data.operations.length){
				$.each(data.operations, function(i, v){

					var $indexInput = $('<input>').attr({
						type:'checkbox',
						name:'operation',
						'data-oid' : v.oid
					}).addClass('ace').val(v.oid);

					var $indexCheck = $('<div></div>').addClass('checkbox col-xs-4');
					var $label = $('<label></label>').append($indexInput).append('<span class="lbl">' + v.name +'</span>');

					$indexCheck.append($label).appendTo($wrap);
				});
			}
		}, null, false);

		//获取角色的操作
		com.post(api.system.queryOperationByRoleId, {'operation.system' : 1, "role.roleId": roleId}, function(data){
			if(data.operations.length){
				$.each(data.operations, function(i, v){
					$wrap.find('input[value="'+ v.oid +'"]').prop('checked', true);
				});
			}
		}, null, false);
	}

	function queryModuleByRoleId(roleId){
		var $wrap = $('#moduleModal').find('.modal-body').empty();
		//获取全部模块
		com.post(api.system.queryModule, {'module.system' : 1}, function(data){

			var menuArr = {
				level1 : [],
				level2 : [],
				level3 : [],
			};

			var menuObj = {
				level1 : {},
				level2 : {},
			};
			var treeData = data.modules;

			var $tree = $('<ol class="dd-list"></ol>');
			var arr ;
			$wrap.append($tree);

			if(!treeData || !treeData.length){
				return;
			}

			$.each(treeData , function(i, v){
				arr = menuArr['level' + v.level]
				arr[arr.length] = v;
			});

			$.each(menuArr, function(key, val){
				menuArr[key] = val.sort(function(a,b){
					return a.mid-b.mid
				});
			});

			if(menuArr.level1.length){
				$.each(menuArr.level1, function(i, v){

					var $li = $('<li></li>').addClass('dd-item');
					var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name);

					var $input = $('<input>').attr({type : 'checkbox', name : 'module'}).addClass('ace').val(v.mid);
					var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({'margin-bottom':'0', 'margin-top' : '-5px'});
					var $label = $('<label></label>').append($input).append('<span class="lbl"></span>');

					$indexCheck.append($label).appendTo($div);

					$li.append($div).appendTo($tree);
					menuObj.level1[v.mid] = $li;
				});
			}

			if(menuArr.level2.length){
				$.each(menuArr.level2, function(i, v){

					var $li = $('<li></li>').addClass('dd-item');
					var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name);

					var $input = $('<input>').attr({type : 'checkbox', name : 'module'}).addClass('ace').val(v.mid);
					var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({'margin-bottom':'0', 'margin-top' : '-5px'});
					var $label = $('<label></label>').append($input).append('<span class="lbl"></span>');

					$indexCheck.append($label).appendTo($div);

					menuObj.level2[v.mid] = $li;

					$li.append($div);

					var $parent = menuObj.level1[v.fatherModule.mid];
					$parent.children('div').hasClass('btn-default') || $parent.children('div').addClass('btn-default');
					if(!$parent.children('button').length){
						var $title = $parent.children('div');
						$('<button type="button" data-action="collapse" class="minus">Collapse</button>').insertBefore($title);
						$('<button type="button" data-action="expand" class="hide plus">Expand</button>').insertBefore($title);
					}

					var $pol = $parent.children('ol').length ? $parent.children('ol') : $('<ol></ol>').addClass('dd-list').appendTo($parent);
					$li.appendTo($pol);
				});
			}

			if(menuArr.level3.length){
				$.each(menuArr.level3, function(i, v){

					var $li = $('<li></li>').addClass('dd-item item-blue2');
					var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name);

					var $input = $('<input>').attr({type : 'checkbox', name : 'module'}).addClass('ace').val(v.mid);

					var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({'margin-bottom':'0', 'margin-top' : '-5px'});
					var $label = $('<label></label>').append($input).append('<span class="lbl"></span>');

					$indexCheck.append($label).appendTo($div);

					menuObj.level2[v.mid] = $li;

					$li.append($div);

					var $parent = menuObj.level2[v.fatherModule.mid];
					if(!$parent.children('button').length){
						var $title = $parent.children('div');
						$('<button type="button" data-action="collapse" class="minus">Collapse</button>').insertBefore($title);
						$('<button type="button" data-action="expand" class="hide plus">Expand</button>').insertBefore($title);
					}

					var $pol = $parent.children('ol').length ? $parent.children('ol') : $('<ol></ol>').addClass('dd-list').appendTo($parent);
					$li.appendTo($pol);
				});
			}

			$('button[data-action="collapse"]').click(function(){
				var $this = $(this);
				$this.siblings('ol').addClass('hide');
				$this.parent().find('.plus').toggleClass('hide');
				$this.toggleClass('hide');
			});

			$('button[data-action="expand"]').click(function(){
				var $this = $(this);
				$this.siblings('ol').removeClass('hide');
				$this.parent().find('.minus').toggleClass('hide');
				$this.toggleClass('hide');
			});

		}, null, false);

		//获取角色的模块
		com.post(api.system.queryModuleByRoleId, {'module.system' : 1, "role.roleId": roleId}, function(data){
			if(data.modules.length){
				$.each(data.modules, function(i, v){
					$wrap.find('input[value="'+ v.mid +'"]').prop('checked', true);
				});
			}
		}, null, false);
	}
	com.post(api.data.queryChainPage,{},function(res){
		role.chainPage = res.chainPages ;
	}, null, false);

	var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){ 
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };


        var creatLine = function(v){
        	
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.roleName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
            var $btnModule = $('<a></a>').addClass('btn btn-minier btn-success').html('模块配置');
            var $btnOperation = $('<a></a>').addClass('btn btn-minier btn-warning').html('操作配置');
			var $chainPage = $('<a></a>').addClass('btn btn-minier btn-yellow').html('外链配置');
            var propertyArr = [
               ["编号:", v.roleId, "grey"],
               ["描述:", v.roleDes, "grey"],
           ];

           $.each(propertyArr, function (index,value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });

            $divBtnWrap.append($chainPage).append($btnModule).append($btnOperation).append($btnEdit).append($btnDel).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);

			$btnModule.click(function(){
				queryModuleByRoleId(v.roleId);
				role.moduleModal.attr('data-roleid', v.roleId).modal('show');
			});

			$btnOperation.click(function(){
				queryOperationByRoleId(v.roleId);
            	role.operationModal.attr('data-roleid', v.roleId).modal('show');
            });
            
            $btnEdit.unbind().bind('click',function(){
            	editRole(v.roleId, v.roleName, v.roleDes);
            });
            
            $btnDel.click(function(){
            	deleteRole(v.roleId);
            });

			$chainPage.click(function(){
				role.chainPageModal.modal("show");
				var options = {
					"roleChainPage.rid": v.rId,
				}
				var chainPages=[];
				var cpids=[];
				var chainPage=[];
				role.roleItems.chainPage.bindData(role.chainPage , "cpid", "name");
				role.roleItems.chainPage.trigger("chosen:updated");
				com.post(api.right.queryRoleChainPageByRid,options, function(res){
					chainPages = res.chainPages;
					$.each(chainPages,function(i,v){
						chainPage.push(v.name)
					});
				}, null, false);

				role.roleItems.currentchainPage.html("");
				chainPage && chainPage.length && $.each(chainPage, function(i, v){
					var $div=$('<div></div>');
					var $span=$('<span class="tag"></span>').html(v).appendTo($div);
					role.roleItems.currentchainPage.append($div);
				});




				$('button[name="saveChainPageBtn"]').unbind().bind('click',function(){
					var newcids=[];
					role.chainPageModal.modal("hide");
					var params={
						"roleChainPage.rid":  v.rId,
					};
					if(role.roleItems.chainPage.val() != null){
						$.each(role.roleItems.chainPage.val().splice(','),function(i,value){

							newcids.push(value);
						});
						$.each(newcids, function(i, val){
							params["cpids" + "[" + i + "]"] = val;
						});
						com.post(api.right.updateRoleChainPage, params,function (res) {
						},null,false);
					}else{
						params["cpids"]=[];
						com.post(api.right.updateRoleChainPage, params,function (res) {
						},null,false);
					}
				});


			});

            return $liLine;
        };
      
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
	
	var searcher = new Searcher();
	
	searcher.init(["roleName"], "condList", api.system.pageRole, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "rolePostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addRole').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="addRole"]', '#pagenation').click(function(){
		role.editFlg = false;
		
		com.cleanItems(role.roleItems);
		
		role.roleItems.roleId.prop("disabled",false).css("display", "none");
		
		role.modal.modal("show");
    });
	
	function editRole(roleId, roleName, roleDes){
		role.editFlg = true;
		
		role.roleItems.roleId.prop("disabled", true).css("display", "block").val(roleId);
		role.roleItems.roleName.val(roleName);
		role.roleItems.roleDes.val(roleDes);
		
		role.modal.modal("show");
	}
	
	function deleteRole(roleId){
		var options = {
			"roleIds[0]": roleId,
		};
		
		com.post(api.system.deleteRoleByIds, options, function(res){
			searcher.doSearch();
		});
	}

	function saveModule(){

		var idarrs = role.moduleModal.find('input[name="module"]:checked');
		var roleid = role.moduleModal.attr('data-roleid');

		var params = {
			// "mids[0]": 1,
			"module.system": 1,
			"role.roleId": roleid,
		}

		if(idarrs.length){
			idarrs.each(function(i){
				params['mids[' + i + ']'] = $(this).val();
			});
		}

		com.post(api.system.updateRoleModuleByRoleId, params, function(){
			role.moduleModal.modal('hide').removeAttr('data-roleid');
		});
	}

	function saveOperation(){

		var idarrs = $('input[name="operation"]:checked');
		var roleid = role.operationModal.attr('data-roleid');

		var params = {
			//"oids[0]": 1
			"operation.system": 1,
			"role.roleId": roleid,
		}

		if(idarrs.length){
			idarrs.each(function(i){
				params['oids[' + i + ']'] = $(this).val();
			});
		}

		com.post(api.system.updateRoleOperationByRoleId, params, function(){
			role.operationModal.modal('hide').removeAttr('data-roleid');
		});
	}

	function saveData(){
		
		if(com.validate()){
			return;
		}
		
		var url;
		var options = {
			'role.roleName': role.roleItems.roleName.val(),
			'role.roleDes': role.roleItems.roleDes.val(),
			'role.roleId': role.roleItems.roleId.val(),
		};
		
		if(role.editFlg){
			url = api.system.updateRole;
		}else{
			url = api.system.addRole;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		role.modal.modal("hide");
	}
	
	function gotoRoleRight(roleId, roleName){
		$("#roleList").addClass("hidden");
		$("#roleRightDiv").removeClass("hidden");
		$("#roleRightRoleId").val(roleId);
		$("#roleRightContent").html("配置角色("+roleName+")权限");
		
		com.post(api.system.queryRoleRight, {"role.roleId": roleId}, function(res){
			 $.fn.zTree.init($("#treeDemo"), setting, res.zTree);
		});
	}

	function goBackRoleList(){
		$("#roleRightDiv").addClass("hidden");
		$("#roleList").removeClass("hidden");
		$("#roleRightRoleId").val("");
		$("#roleRightContent").html("配置角色()权限");
	}

	function saveRoleRight(){
		var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		zTreeNodes = treeObj.getNodes();
		
		var rightTree=[];
		var params = {};
		
		for(var i=0;i<zTreeNodes.length;++i){
			var module = {};
			params["rightTree["+i+"].id"]= zTreeNodes[i].id;
			params["rightTree["+i+"].name"]= zTreeNodes[i].name;
			params["rightTree["+i+"].checked"]= zTreeNodes[i].checked;
			params["rightTree["+i+"].open"]= zTreeNodes[i].open;
			params["rightTree["+i+"].nocheck"]= zTreeNodes[i].nocheck;
			params["rightTree["+i+"].chkDisabled"] = zTreeNodes[i].chkDisabled;
			
			for(var j=0;j<zTreeNodes[i].children.length;++j){
				var func = {};
				params["rightTree["+i+"].children["+j+"].id"] = zTreeNodes[i].children[j].id;
				params["rightTree["+i+"].children["+j+"].name"] = zTreeNodes[i].children[j].name;
				params["rightTree["+i+"].children["+j+"].checked"]=zTreeNodes[i].children[j].checked;
				params["rightTree["+i+"].children["+j+"].open"]=zTreeNodes[i].children[j].open;
				params["rightTree["+i+"].children["+j+"].nocheck"]=zTreeNodes[i].children[j].nocheck;
				params["rightTree["+i+"].children["+j+"].chkDisabled"]=zTreeNodes[i].children[j].chkDisabled;
				
				for(var k=0;k<zTreeNodes[i].children[j].children.length;++k){
					params["rightTree["+i+"].children["+j+"].children["+k+"].id"]= zTreeNodes[i].children[j].children[k].id;
					params["rightTree["+i+"].children["+j+"].children["+k+"].name"] =zTreeNodes[i].children[j].children[k].name;
					params["rightTree["+i+"].children["+j+"].children["+k+"].checked"] =zTreeNodes[i].children[j].children[k].checked;
					params["rightTree["+i+"].children["+j+"].children["+k+"].open"]=zTreeNodes[i].children[j].children[k].open;
					params["rightTree["+i+"].children["+j+"].children["+k+"].nocheck"]=zTreeNodes[i].children[j].children[k].nocheck;
					params["rightTree["+i+"].children["+j+"].children["+k+"].chkDisabled"] =zTreeNodes[i].children[j].children[k].chkDisabled;
					
					for(var m=0;m<zTreeNodes[i].children[j].children[k].children.length;++m){
						params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].id"]= zTreeNodes[i].children[j].children[k].children[m].id;
						params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].name"]=zTreeNodes[i].children[j].children[k].children[m].name;
						params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].checked"]=zTreeNodes[i].children[j].children[k].children[m].checked;
						params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].open"] =zTreeNodes[i].children[j].children[k].children[m].open;
						params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].nocheck"]=zTreeNodes[i].children[j].children[k].children[m].nocheck;
						params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].chkDisabled"] =zTreeNodes[i].children[j].children[k].children[m].chkDisabled;
					}
				}
			}
		}
		params["role.roleId"]= $("#roleRightRoleId").val();

		com.post(api.system.updateRoleRight, params, function(res){
			com.showAlert(com.info, "操作成功");
			goBackRoleList();
		});
	}
});
