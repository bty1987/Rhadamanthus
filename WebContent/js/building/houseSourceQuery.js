
jQuery(function($) {

	var houseSource = {
		houseSources: {},
		hsid: null,
		csid: null,
		deployedBtn: null,
		bsaveBtn: null,
		bcancelBtn: null,
		modal: null,
		houseSourceId: null,
		houseId: null,
		buildItems: [],
		hsType: [],
		houseType: [],
		decorateDegree: [],
		discussType: [],
		orientation: [],
		payType: [],
		balanceStatus: [],
		rentType: [],
		repeatFlg: null,
		validator: null,
	};

	com.post(api.ds.building, {}, function(res){
		$.each(res.hsType, function (i,va) {
			houseSource.hsType[va.key] = va.value;
		});
		$.each(res.houseType, function (i,va) {
			houseSource.houseType[va.key] = va.value;
		});
		$.each(res.discussType, function (i,val) {
			houseSource.discussType[val.key] = val.value;
		});
		$.each(res.decorateDegree, function (i,val) {
			houseSource.decorateDegree[val.key] = val.value;
		});
		$.each(res.orientation, function (i,v) {
			houseSource.orientation[v.key] = v.value;
		});
		$.each(res.rentType, function (i,v) {
			houseSource.rentType[v.key] = v.value;
		});

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

			var that = this;
			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnAll = $('<a></a>').addClass('btn btn-minier btn-yellow').html("查看");
			var propertyArr = [
				["房源类型:", houseSource.hsType[v.type], "red"],
				["房屋类型:", houseSource.houseType[v.house.type], "red"],
				["楼盘地址:", v.house.village.name, "grey"],
				["面积:", v.house.buildArea  + "平", "blue"],
				["总价:", toMoney(v.totalPrice) + "元", "blue"],
				["装修程度:", houseSource.decorateDegree[v.decorateDegree], "grey"],
				["户型:", v.house.houseType, "grey"],
				["房屋朝向:", houseSource.orientation[v.house.orientation], "grey"],
				["商议类型:", houseSource.discussType[v.discussType], "red"],
				["交租方式:", houseSource.rentType[v.rentType], "grey"],
				["房源等级:", v.housingGrade, "grey"]
			];

			$.each(propertyArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnAll).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			//查看   可以看见房源的所有信息  包括图片  和上传图片
			$btnAll.click(function(){
				params.hsStatus = v.status;
				params.drawingId = v.hsid;
				params.type = v.type;
				params.manageFlag = false;//控制是否显示敏感信息  是否应该在后台做拦截
				params.page = "query";
				com.switchPage(api.index.houseSourceDetail.url);
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
	var conditionList = ["houseSourceNo", "houseType", "b_houseSourceType", "b_villageName", "buildingArea", "b_totalPrice", "roomNum", "orientation", "b_decorateDegree", "b_allowLoan", "b_housingGrade", "b_rentType"];

	searcher.init(conditionList, "condList", api.building.pageHouseSource, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "houseSourceQueryPostData", {"filters[0].field":"status", "filters[0].data":3, "filters[0].op":"eq"}  , false, null, null);

	//转换金额
	function toMoney(num){
		num = num.toFixed(2);
		num = parseFloat(num)
		num = num.toLocaleString();
		return num;
	}
});
