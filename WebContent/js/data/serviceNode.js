
jQuery(function($) {

	var serviceNodeType = {};
	var serviceNode = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,
		snid : null,
		status:{
			0: "启用",
			1: "禁用"
		},
		items:{},
		editFlg: false,
	};

	serviceNode.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	serviceNode.cancelBtn = com.focusPage("#cancelBtn");

	serviceNode.items.serviceNodeName = com.focusPage("#serviceNodeName");
	serviceNode.items.serviceNodeType = com.focusPage("#serviceNodeType");
	serviceNode.items.serviceNodeDetail = com.focusPage("#serviceNodeDetail");

	serviceNode.modal = com.focusPage("#serviceNodeModal");
	serviceNode.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});

	$.extend(com.validator, serviceNode.validator);

	com.post(api.ds.data, {}, function(res){
        com.focusPage("#serviceNodeType").bindData(res.serviceNodeType, "key", "value");
		$.each(res.serviceNodeType,function (i,val) {
			serviceNodeType[val.key] = val.value;
		});
	}, null, false);

	var displayFunc  = (function(){

		var renderList = function(tableId, listData){
			com.debug(listData);
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

			var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html("编辑");
			var $btnDel = $('<input />').attr("type", "checkbox").addClass('ace ace-switch ace-switch-5').attr("checked", v.status == 0 ? true : false);
			var $btnSpan = $('<span></span>').addClass("lbl status-lbl");

			var propertyArr = [
				["详情:", v.detail, "grey"],
				["类型:", serviceNodeType[v.type], "grey"],
				["状态:", serviceNode.status[v.status], "red"],
			];

			$.each(propertyArr, function(index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnView).append($btnDel).append($btnSpan).appendTo($h3);
			$liLine.append($h3).append($ulProperty);

			$btnView.click(function(){
				serviceNode.editFlg = false;
				serviceNode.snid = v.snid;
				com.cleanItems(serviceNode.items);
                com.focusPage("#serviceNodeModal").modal("show");
			});

			$btnDel.click(function(){
				var cvalue = $btnDel.prop("checked");
				if(cvalue){
					cvalue = 0;
				}else{
					cvalue = 1;
				}
				updateNodeStatus(v.snid, cvalue);
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

	searcher.init(["data-serviceNode-type"], "condList", api.communion.pageServiceNode, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "serviceNodeData", null, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addServiceNode').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		return [$adda];
	});

	//添加
    com.focusPage('a[name="addServiceNode"]', '#pagenation').click(function(){
		serviceNode.editFlg = true;
		com.cleanItems(serviceNode.items);
        com.focusPage("#serviceNodeModal").modal("show");
	});

	function updateNodeStatus(snid, cvalue){
		var options = {};
		options["serviceNode.snid"] = snid;
		options["serviceNode.status"] = cvalue;

		com.post(api.communion.updateServiceNodeForStatus, options, function(res){
			searcher.doSearch();
		});
	}

	function saveData(){
		if(serviceNode.editFlg){
			addServiceNode()
		}else{
			updateServiceNode(serviceNode.snid);
		}
	}

	function addServiceNode(){
		if(com.validate()){
			return;
		}

		var options = {};
		options["serviceNode.name"] = serviceNode.items.serviceNodeName.val();
		options["serviceNode.type"] = serviceNode.items.serviceNodeType.val();
		options["serviceNode.detail"] = serviceNode.items.serviceNodeDetail.val();

		com.post(api.communion.addServiceNode, options, function(res){
			searcher.doSearch();
            com.focusPage("#serviceNodeModal").modal("hide");
		});
	}

	function updateServiceNode(id){
		if(com.validate()){
			return;
		}

		var options = {};
		options["serviceNode.snid"] = id;
		options["serviceNode.name"] = serviceNode.items.serviceNodeName.val();
		options["serviceNode.type"] = serviceNode.items.serviceNodeType.val();
		options["serviceNode.detail"] = serviceNode.items.serviceNodeDetail.val();
		com.post(api.communion.updateServiceNode, options, function(res){
			searcher.doSearch();
            com.focusPage("#serviceNodeModal").modal("hide");
		});
	}
});
