$(function(){

	var quoteType = {
			saveBtn : com.focusPage("#saveBtn"),
			cancelBtn : com.focusPage("#cancelBtn"),

			modals: {
				quoteTypeModal: com.focusPage("#quoteTypeModal")
			},
			items : {
				name : com.focusPage("#name")
			},
			editFlg : true,
	};

	quoteType.saveBtn.bindClick(saveData);

	quoteType.modals.quoteTypeModal.on("hide.bs.modal", function(){
		com.clearValidator();
		com.cleanItems(quoteType.items);
	});

	var displayFunc = (function () {
		/*表格样式*/
		var renderList = function (tableId, listData) {
			var $tableWrap = com.focusPage('#' + tableId);

			if (listData && listData.length) {
				var $ulTitle = createTableTitle();
				var $ulData = $('<ul></ul>').addClass('flex-table');
				$tableWrap.append($ulTitle).append($ulData);

				$.each(listData, function (i, v) {
					var $liLine = creatLine(i, v, i == listData.length - 1);
					$liLine.appendTo($ulTitle);
				})
			}

		};
		/*表格头*/
		var createTableTitle = function () {
			var $ulTitle = $('<ul></ul>').addClass('flex-table');
			var $liTitle = $('<li></li>').addClass('line table-title');
			var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
			var $contentWrap = $('<div></div>').addClass('line-wrap content col3');
			var titleName = '编号,报价类型,状态';

			$.each(titleName.split(','), function (i, v) {
				var $cell = $('<div></div>').addClass('cell col-xs-4').html(v);
				$cell.appendTo($contentWrap);
			});

			var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

			$liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

			return $ulTitle;
		};
		/*表格体*/
		var creatLine = function (i, v, lastFlag) {
		    
			var $liLine = $('<li></li>').addClass('line');
			
			var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index blue').html(i + 1));
			var $contentWrap = $('<div></div>').addClass('line-wrap content col3');
			
			var propertyArr = [
               [v.qtid,'blue'],
               [v.name,'grey'],
               [constant.production().quoteType.status.keys[v.status],'red']
           ];

			$.each(propertyArr, function (i, v) {
				var $cell = $('<div></div>').addClass('cell col-xs-4 '+v[1]+'').html(v[0]);
				$cell.appendTo($contentWrap);
			});

			var $optionWrap = $('<div></div>').addClass('line-wrap action');
			var $cellOption = $('<div></div>').addClass('cell option');

			var $btnGroup = $('<div></div>').addClass('btn-group');
			var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
			var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

			//操作按钮下面的选项
			var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
			var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
			var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));

			$btnUl.append($btnEdit).append($btnStart).append($btnStop);
			$btnGroup.append($btn).append($btnUl).appendTo($cellOption);
			$cellOption.appendTo($optionWrap);

			$liLine.append($indexWrap).append($contentWrap).append($optionWrap);
			//编辑点击事件
			$btnEdit.click(function () {

				quoteType.editFlg = false;

				quoteType.items.qtid = v.qtid;
				quoteType.items.name.val(v.name);
				quoteType.modals.quoteTypeModal.modal("show");
			});

			//状态启用事件
			$btnStart.click(function(){
				changeQuoteTypeStatus(v.qtid, 0, v.status);
			});

			//状态禁用事件
			$btnStop.click(function(){
				changeQuoteTypeStatus(v.qtid, 1, v.status);
			})

			return $liLine;
		};

		return {
			init: function (tableId, listData) {
				com.focusPage('#' + tableId).html(null);
				renderList(tableId, listData);
			},
            drawLine : function(v){
                return creatLine(v);
            }
		};
	})();

	var quoteTypeSeacher = new Searcher();

	quoteTypeSeacher.init(["production-quoteType-name"], "condList", api.production.pageQuoteType, function (data) {
		displayFunc.init('resultList', data);
	}, "pagenation", " quoteTypePostData",null,false,null,function() {

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addQuoteType').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		return [$adda];
	});

	com.focusPage("#addQuoteType").click(function() {
		quoteType.editFlg = true;

		quoteType.modals.quoteTypeModal.modal("show");
	});

	//添加数据
	function saveData() {

		if (com.validate('quoteTypeModal')) {
			return false;
		}
		var url;
		var options = {
				"quoteType.name": quoteType.items.name.val()
		};

		quoteType.editFlg ? url = api.production.addQuoteType : url = api.production.updateQuoteType, options["quoteType.qtid"] =  quoteType.items.qtid;

		com.post(url, options, function(res){
			com.closePopup();
			com.showAlert(com.info, "操作成功");
			quoteTypeSeacher.doSearch();
		});
		quoteType.modals.quoteTypeModal.modal("hide");
	}

	/*btnType:0 启用功能,1 禁用功能
     statusFlag:当前状态是否与想要完成的功能相冲 */
	function changeQuoteTypeStatus(id,btnType,statusFlag) {

		var status = btnType == 0 ? "启用" : "禁用";

		if(statusFlag == btnType){
			com.showAlert(com.warning, "已"+status+"无需重复当前操作");
			return false;
		}

		com.post(api.production.updateQuoteTypeForStatus, {
			"quoteType.qtid": id,
			"quoteType.status": btnType
		}, function (res) {
			quoteTypeSeacher.doSearch();
			com.showAlert(com.info, "已"+status);
		});
	}
});