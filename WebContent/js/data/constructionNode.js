
jQuery(function($) {

	var constructionNode = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,

		items:{},

		editFlg: false,
	};

	constructionNode.saveBtn = $("#saveBtn").on("click", saveData);
	constructionNode.cancelBtn = $("#cancelBtn");

	constructionNode.items.constructionNodeId = $("#constructionNodeId");
	constructionNode.items.constructionNodeName = $("#constructionNodeName");

	constructionNode.modal = $("#constructionNodeModal");
	constructionNode.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#constructionNodeId", true);
	});

	$.extend(com.validator, constructionNode.validator);

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

			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h3 = $('<h3></h3>').append($('<small></small>').addClass('blue').html(v.cnid + "  " + v.name));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnDel = $('<input />').attr("type","checkbox").addClass('ace ace-switch ace-switch-5').attr("checked", v.status == 0 ? true : false);
			var $btnSpan = $('<span></span>').addClass("lbl status-lbl");

			$divBtnWrap.append($btnDel).append($btnSpan).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			$btnDel.click(function(){
				var cvalue = $btnDel.prop("checked");
				if(cvalue){
					cvalue = 0;
				}else{
					cvalue = 1;
				}
				updateconstructionNode(v.cnid, cvalue);
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

	searcher.init(["c_name"], "condList", api.data.pageConstructionNode, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "constructionNodePostData",null, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addConstructionNode').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		return [$adda];
	});

	//添加
	$('a[name="addConstructionNode"]', '#pagenation').click(function(){
		$("#constructionNodeName").val("");
		$("#constructionNodeModal").modal("show");
	});

	function updateconstructionNode(constructionNodeId, cvalue){
		var options = {};
		options["constructionNode.cnid"] = constructionNodeId;
		options["constructionNode.status"] = cvalue;

		com.post(api.data.updateConstructionNodeForStatus, options, function(res){
			searcher.doSearch();
		});
	}

	function saveData(){
		if(com.validate()){
			return;
		}

		var url;
		var options = {
			'constructionNode.name': constructionNode.items.constructionNodeName.val(),
		};

		url = api.data.addConstructionNode;

		com.post(url, options, function(res){
			searcher.doSearch();
		});

		constructionNode.modal.modal("hide");
	}
});
