
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
	
	role.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	role.operationSaveBtn = com.focusPage('#operationModal').find(' button[name="saveBtn"]').on("click", saveOperation);
	role.moduleSaveBtn = com.focusPage('#moduleModal').find(' button[name="saveBtn"]').on("click", saveModule);
	role.cancelBtn = com.focusPage("#cancelBtn");
	role.modal = com.focusPage("#roleModal");
	role.operationModal = com.focusPage("#operationModal");
	role.moduleModal = com.focusPage("#moduleModal");
	role.roleItems.no = com.focusPage("#roleId");
	role.roleItems.content = com.focusPage("#roleDes");
	role.roleItems.name = com.focusPage("#roleName");
	role.chainPageModal = com.focusPage("#chainPageModal");
	role.roleItems.currentchainPage = com.focusPage("#currentchainPage");
	role.roleItems.chainPage = com.focusPage("#chainPage").chosen({
		width: "200px"
	});

	role.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#roleName", true);
		com.clearValidator("#roleId", true);
	});
	
	$.extend(com.validator, role.validator);
	
	com.focusPage("#cancelRoleRightBtn").on("click",goBackRoleList);
	com.focusPage("#saveRoleRightBtn").on("click",saveRoleRight);

	function queryOperationByRoleId(rid){
		var $wrap = com.focusPage('#operationModal').find('.modal-body').empty();
		//获取全部操作
		com.post(api.system.queryOperation, {'operation.system' : 1}, function(data){

			if(data.operations.length){
				$.each(data.operations, function(i, v){

					var $indexInput = $('<input>').attr({
						type:'checkbox',
						name:'operation',
						'data-oid' : v.oid
					}).addClass('ace').val(v.oid);

					var $label = $('<label style="margin-right:20px;display: inline-block;min-width: 25%;"></label>').append($indexInput).append('<span class="lbl">' + v.name +'</span>');

							$label.appendTo($wrap);
				});
			}
		}, null, false);

		//获取角色的操作
		com.post(api.system.queryOperationByRid, {'operation.system' : 1, "role.rid": rid}, function(data){
			if(data.operations.length){
				$.each(data.operations, function(i, v){
					$wrap.find('input[value="'+ v.oid +'"]').prop('checked', true);
				});
			}
		}, null, false);
	}

	function queryModuleByRoleId(roleId){
		var $wrap = com.focusPage('#moduleModal').find('.modal-body').empty();
		//获取全部模块
		com.post(api.system.queryModuleForLogin, {'module.system' : 1}, function(data){

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
				arr = menuArr['level' + v.level];
				arr[arr.length] = v;
			});

			$.each(menuArr, function(key, val){
				menuArr[key] = val.sort(function(a,b){
					return a.mid-b.mid;
				});
			});

			if(menuArr.level1.length){
				$.each(menuArr.level1, function(i, v){

					var $li = $('<li></li>').addClass('dd-item');
					var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name + "-" + v.alias);

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
					var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name + "-" + v.alias);

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
					var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name + "-" + v.alias);

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
		com.post(api.system.queryModuleByRid, {'module.system' : 1, "role.rid": roleId}, function(data){
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
            var $tableWrap = com.focusPage('#' + tableId);
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
        	
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $chainPage = $('<a></a>').addClass('btn btn-minier btn-yellow').html('外链配置');
            var $btnModule = $('<a></a>').addClass('btn btn-minier btn-success').html('模块配置');
            var $btnOperation = $('<a></a>').addClass('btn btn-minier btn-warning').html('操作配置');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-inverse').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
            
            var propertyArr = [
               ["编号:", v.no, "grey"],
               ["描述:", v.content, "grey"]
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
				queryModuleByRoleId(v.rid);
				role.moduleModal.attr('data-roleid', v.rid).modal('show');
			});

			$btnOperation.click(function(){
				queryOperationByRoleId(v.rid);
            	role.operationModal.attr('data-roleid', v.rid).modal('show');
            });
            
            $btnEdit.unbind().bind('click',function(){
            	editRole(v.rid, v.no, v.name, v.content);
            });
            
            $btnDel.click(function(){
            	deleteRole(v.rid);
            });

			$chainPage.click(function(){
				role.chainPageModal.modal("show");
				var options = {
					"roleChainPage.rid": v.rid
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
						"roleChainPage.rid":  v.rid,
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
				com.focusPage('#' + tableId).html(null);
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
	
	com.focusPage('[name="addRole"]', com.focusPage('#pagenation')).click(function(){
		role.editFlg = false;
		
		com.cleanItems(role.roleItems);
		
		role.roleItems.no.prop("disabled",false).css("display", "none");
		
		role.modal.modal("show");
    });
	
	function editRole(rid, no, name, content){
		role.editFlg = true;
		
		role.roleItems.rid = rid;
		role.roleItems.no.prop("disabled", true).css("display", "block").val(no);
		role.roleItems.name.val(name);
		role.roleItems.content.val(content);
		
		role.modal.modal("show");
	}
	
	function deleteRole(roleId){
		var options = {
			"rid": roleId,
		};
		
		com.post(api.system.deleteRoleByRid, options, function(res){
			searcher.doSearch();
		});
	}

	function saveModule(){

		var idarrs = role.moduleModal.find('input[name="module"]:checked');
		var roleid = role.moduleModal.attr('data-roleid');

		var params = {
			"module.system": 1,
			"role.rid": roleid
		};

		if(idarrs.length){
			idarrs.each(function(i){
				params['mids[' + i + ']'] = $(this).val();
			});
		}
		
		

		com.post(api.system.updateRoleModuleByRid, params, function(){
			role.moduleModal.modal('hide').removeAttr('data-roleid');
		});
	}

	function saveOperation(){

		var idarrs = $('input[name="operation"]:checked');
		var roleid = role.operationModal.attr('data-roleid');

		var params = {
			"operation.system": 1,
			"role.rid": roleid,
		}

		if(idarrs.length){
			idarrs.each(function(i){
				params['oids[' + i + ']'] = $(this).val();
			});
		}
		
		com.post(api.system.updateRoleOperationByRid, params, function(){
			role.operationModal.modal('hide').removeAttr('data-roleid');
		});
	}

	function saveData(){
		
		if(com.validate()){
			return;
		}
		
		var url;
		var options = {
			'role.name': role.roleItems.name.val(),
			'role.content': role.roleItems.content.val(),
			'role.rid': role.roleItems.rid,
			'role.no': role.roleItems.no.val()
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
		com.focusPage("#roleList").addClass("hidden");
		com.focusPage("#roleRightDiv").removeClass("hidden");
		com.focusPage("#roleRightRoleId").val(roleId);
		com.focusPage("#roleRightContent").html("配置角色("+roleName+")权限");
		
		com.post(api.system.queryRoleRight, {"role.rid": roleId}, function(res){
			 $.fn.zTree.init(com.focusPage("#treeDemo"), setting, res.zTree);
		});
	}

	function goBackRoleList(){
		com.focusPage("#roleRightDiv").addClass("hidden");
		com.focusPage("#roleList").removeClass("hidden");
		com.focusPage("#roleRightRoleId").val("");
		com.focusPage("#roleRightContent").html("配置角色()权限");
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
		params["role.no"]= com.focusPage("#roleRightRoleId").val();

		com.post(api.system.updateRoleRight, params, function(res){
			com.showAlert(com.info, "操作成功");
			goBackRoleList();
		});
	}
});
