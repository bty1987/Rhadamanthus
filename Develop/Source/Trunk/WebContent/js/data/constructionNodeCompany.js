$(function(){

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
			var $h3 = $('<h3></h3>');
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($h3);
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('配置工程节点');

			var propertyArr = [
				["公司: ", v.name, "grey"],
				["编号: ", v.no, "grey"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnEdit).append($btnEdit).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			//编辑按钮的点击事件
			$btnEdit.click(function(){
				editConstructionNodeCompany(v);
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
		};
	})();


	var companySeacher = new Searcher();

	companySeacher.init( ["companyName"], "condList", api.system.pageCompany, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "companyPostDataTwo", null, false, null, null);

	//定义全局变量  json
	var constructionNodeCompany = {
		cancelBtn: null,
		modal: null,
		constructionNodeCompanyItems: {},

		editFlg: false,
		repeatFlg:false
	};

	constructionNodeCompany.cancelBtn = $("#cancelBtn");
	constructionNodeCompany.modal = $("#constructionNodeModal");
	constructionNodeCompany.constructionNodeCompanyItems.nodeName = $("#nodeName").chosen({
		width: "216px"
	});

	//配置工程节点
	function editConstructionNodeCompany(row){

		com.post(api.data.queryConstructionNode,{"constructionNode.status":0},function(res){
			constructionNodeCompany.nodeNames = res.constructionNodes;
		},null,false);

		if(constructionNodeCompany.nodeNames && constructionNodeCompany.nodeNames.length > 0){
			$.each(constructionNodeCompany, function(i, v){
				constructionNodeCompany.constructionNodeCompanyItems.nodeName.bindData(v, "cnid", "name");
			});
		}
		$("#companyName").val(row.name);
		constructionNodeCompany.modal.modal("show");
		var options = {
			"constructionNodeCompany.cid": row.cid,
		}

		var constructionNodes = {};
		var cnids = [];

		//工程节点
		com.post(api.data.queryConstructionNodeByCid, options, function(res){
			constructionNodes = res.constructionNodes ;

			$.each(constructionNodes,function(i,v){
				cnids.push(v.cnid);
			});
		}, null, false);

		constructionNodeCompany.constructionNodeCompanyItems.nodeName.trigger("chosen:updated");

		$.each(cnids, function(i,val){
			$("[value\x3d'" + val + "']", constructionNodeCompany.constructionNodeCompanyItems.nodeName).attr("selected", "selected")
		});

		constructionNodeCompany.constructionNodeCompanyItems.nodeName.trigger("chosen:updated");

		$("#saveBtn").unbind("click");
		$("#saveBtn").click(function(){
			if(com.validate()){
				return;
			}

			var newcnids=[];

			$.each(constructionNodeCompany.constructionNodeCompanyItems.nodeName.val().splice(','),function(i,value){
				newcnids.push(value);
			});

			var params={
				"constructionNodeCompany.cid": row.cid,
			}
			$.each(newcnids, function(i, val){
				params["cnids" + "[" + i + "]"] = val;
			});

			com.post(api.data.updateConstructionNodeCompany, params, null, null,false)

			constructionNodeCompany.modal.modal("hide");
			return;
		});
	}

	function successCallback(){
		companySeacher.doSearch();
	}

});
