
jQuery(function($) {

	var buildingNodeType = {};
	var buildingNode = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,

		items:{},

		editFlg: false,
	};

	buildingNode.saveBtn = $("#saveBtn").on("click", saveData);
	buildingNode.cancelBtn = $("#cancelBtn");

	buildingNode.items.buildingNodeName = $("#buildingNodeName");
	buildingNode.items.buildingNodeType = $("#buildingNodeType");

	buildingNode.modal = $("#buildingNodeModal");
	buildingNode.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});

	$.extend(com.validator, buildingNode.validator);
	
	com.post(api.ds.building, {}, function(res){
        $("#buildingNodeType").bindData(res.payType, "key", "value");
        $.each(res.payType,function (i,val) {
        	buildingNodeType[val.key] = val.value;
        });
    }, null, false);

	var displayFunc  = (function(){

		var renderList = function(tableId, listData){
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

			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnDel = $('<input />').attr("type", "checkbox").addClass('ace ace-switch ace-switch-5').attr("checked", v.status == 0 ? true : false);
			var $btnSpan = $('<span></span>').addClass("lbl status-lbl");

			var propertyArr = [
				["节点类型:", buildingNodeType[v.type], "red"],
				["节点名称:", v.name, "grey"],
            ];

            $.each(propertyArr, function(index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
			
			$divBtnWrap.append($btnDel).append($btnSpan).appendTo($h3);
			$liLine.append($h3).append($ulProperty);

			$btnDel.click(function(){
				var cvalue = $btnDel.prop("checked");
				if(cvalue){
					cvalue = 0;
				}else{
					cvalue = 1;
				}
				updateBN(v.bnid, cvalue);
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

	var _condArr = ['buildingNodeType'];
	
	searcher.init(_condArr, "condList", api.building.pageBuildingNode, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "buildingNodePostData", null, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addBuildingNode').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		return [$adda];
	});

	//添加
	$('a[name="addBuildingNode"]', '#pagenation').click(function(){
		$("#buildingNodeName").val("");
		$("#buildingNodeType").val("");
		$("#buildingNodeModal").modal("show");
	});

	function updateBN(bnId, cvalue){
		var options = {};
		options["buildingNode.bnid"] = bnId;
		options["buildingNode.status"] = cvalue;
		
		com.post(api.building.updateBuildingNodeForStatus, options, function(res){
			searcher.doSearch();
		});
	}

	function saveData(){
		if(com.validate()){
			return;
		}

		var url;
		var options = {
			'buildingNode.name': buildingNode.items.buildingNodeName.val(),
			'buildingNode.type': buildingNode.items.buildingNodeType.val(),
		};

		url = api.building.addBuildingNode;

		com.post(url, options, function(res){
			searcher.doSearch();
		});

		buildingNode.modal.modal("hide");
	}
});
