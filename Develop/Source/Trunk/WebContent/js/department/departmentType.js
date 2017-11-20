
jQuery(function($) {

	var bRegion = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,
		items:{},

		editFlg: false,

	};

	bRegion.saveBtn = $("#saveBtn").on("click", saveData);
	bRegion.cancelBtn = $("#cancelBtn")

	bRegion.items.businessRegionName = $("#businessRegionName");

	bRegion.modal = $("#businessRegionModal");
	bRegion.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#businessRegionId", true);
	});

	$.extend(com.validator, bRegion.validator);

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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.deptName));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnSpan = $('<span></span>').addClass("lbl status-lbl");

			var propertyArr = [
				["部门名称:", v.name, "grey"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.appendTo($h3);

			$liLine.append($h3).append($ulProperty);

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

	searcher.init(["deptName"], "condList", api.department.pageDepartmentType, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "businessRegionPostData", bRegion.postParam, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'businessRegionModal').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		return [$adda];
	});

	$('a[name="businessRegionModal"]', '#pagenation').click(function(){

		bRegion.modal.modal("show");
	});

	function saveData(){

		if(com.validate()){
			return;
		}

		var url;
		var options = {
			'dept.deptName': bRegion.items.businessRegionName.val(),
		};


			url = api.department.addDepartmentType;
			options['departmentType.name'] =bRegion.items.businessRegionName.val();

		com.post(url, options, function(res){
			searcher.doSearch();
		});

		bRegion.modal.modal("hide");
	}
});

