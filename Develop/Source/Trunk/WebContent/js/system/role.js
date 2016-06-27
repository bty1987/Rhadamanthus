var role = {
	saveBtn: null,
	cancelBtn: null,
	modal: null,
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

jQuery(function($) {
	role.listgrid = $("#listgrid");
	role.gridPager = "#gridPager";
	role.saveBtn = $("#saveBtn").on("click", saveData);
	role.cancelBtn = $("#cancelBtn");
	role.modal = $("#roleModal");
	role.roleItems.roleId = $("#roleId");
	role.roleItems.roleDes = $("#roleDes");
	role.roleItems.roleName = $("#roleName");
	
	role.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#roleName", true);
		com.clearValidator("#roleId", true);
	});
	
	$.extend(com.validator, role.validator);
	
	var searchOpts = {
		url: api.system.pageRole,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: role.listgrid,
		items: [
		    {label:"角色名称",id:"roleNameSearch",name:"roleName", type:'text'}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	$("#cancelRoleRightBtn").on("click",goBackRoleList);
	$("#saveRoleRightBtn").on("click",saveRoleRight);
	
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
            var $btnConfig = $('<a></a>').addClass('btn btn-minier btn-success').html('配置权限');
            
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

            $divBtnWrap.append($btnConfig).append($btnEdit).append($btnDel).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnConfig.click(function(){
            	gotoRoleRight(v.roleId);
            });
            
            $btnEdit.click(function(){
            	editRole(v.roleId, v.roleName, v.roleDes);
            });
            
            $btnDel.click(function(){
            	deleteRole(v.roleId);
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
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addRole').css('margin-top', '7px').css('margin-right', '7px');
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
		
		$.jgrid.refreshGrid(role.listgrid, role.postParam);
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
