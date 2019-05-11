
jQuery(function($) {

	var vprize = {
		vpid: null,
		saveBtn: null,
		modal: null,
		items:{},
	};
	
	var validator = {
		float3: {
            type: "v_float_3",
            regex: /^([0-9]+|[0-9]+\.[0-9]{1,3})$/,
            errorMsg: "数量格式错误"
        }
    };
	
	$.extend(com.validator, validator);

	vprize.saveBtn = com.focusPage("#saveBtn").on("click", saveData);

	vprize.items.vactivity = com.focusPage("#addVprizeModal").find("#vactivity");
	vprize.items.name = com.focusPage("#addVprizeModal").find("#name");
	vprize.items.price = com.focusPage("#addVprizeModal").find("#price");
	
	vprize.addVprizeModal = com.focusPage("#addVprizeModal");
	
	vprize.addVprizeModal.on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	com.post(api.information.queryVactivity, {}, function(res){
		vprize.items.vactivity.bindData(res.vactivitys, "vaid", "name");
	});

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
			var $h3 = $('<h3></h3>').addClass("oid").append($('<small></small>').addClass('blue').html(v.name));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnViews = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');

			var propertyArr = [
				["名称: ", v.name, "grey"],
				["价格: ", v.price, "blue"],
				["状态: ", v.status == 0 ? "启用" : "禁用", "red"]
			];

			$.each(propertyArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnViews).appendTo($h3);

			$liLine.append($h3).append($ulProperty);
			
			$btnViews.click(function(){
				
				vprize.vpid = v.vpid;
				
				vprize.items.vactivity.val(v.vaid);
				vprize.items.name.val(v.name);
				vprize.items.price.val(v.price);
				
				vprize.addVprizeModal.modal("show");
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
		};
	})();

	var searcher = new Searcher();

	searcher.init(["vprizeName", "vprizeStatus"], "condList", api.information.pageVprize, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "vprizePostData",null, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addVprize').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		return [$adda];
	});

	//添加
	com.focusPage('a[name="addVprize"]', '#pagenation').click(function(){
		
		vprize.vpid = null;
		
		com.cleanItems(vprize.items);
		
		vprize.addVprizeModal.modal("show");
	});

	function saveData(){
		
		if(com.validate("addVprizeModal")){
			return false;
		}

		var url = api.information.addVprize;
		var options = {
			'vprize.vaid': vprize.items.vactivity.val(),
			'vprize.name': vprize.items.name.val(),
			'vprize.price': vprize.items.price.val()
		};
		
		if(vprize.vpid){
			url = api.information.updateVprize;
			
			options["vprize.vpid"] = vprize.vpid;
		}
		
		com.post(url, options, function(res){
			
			com.showAlert(com.info, "操作成功");
			
			searcher.doSearch();
			vprize.addVprizeModal.modal("hide");
		});
	}

});
