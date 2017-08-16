
$(function(){

	//自定义覆盖物
	function ComplexCustomOverlay(point, text, mouseoverText){
		this._point = point;
		this._text = text;
		this._mouseoverText = mouseoverText;
	}

	//标记点提示框样式
	ComplexCustomOverlay.prototype = new BMap.Overlay();
	ComplexCustomOverlay.prototype.initialize = function(map){
		this._map = map;

		//定位点
		var circle = document.createElement('section');
		circle.setAttribute('class' ,'position-mark') ;

		this._circle = circle;

		mp.getPanes().labelPane.appendChild(circle);

		//文字描述
		var div = this._div = document.createElement("div");
		div.setAttribute('class', 'txt');
		//div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat); //堆叠顺序

		var span = this._span = document.createElement("span");
		div.appendChild(span);
		span.innerHTML = this._text;
		var that = this;

		//箭头边框
		var arrowBorder = this._arrow = document.createElement("div");
		arrowBorder.setAttribute('class', 'arrow-border');
		div.appendChild(arrowBorder);

		//提示框下面的小三角和提示框横向位置
		var arrow = this._arrow = document.createElement("div");
		arrow.setAttribute('class', 'arrow');
		div.appendChild(arrow);

		//鼠标放上和离开的触发事件
		div.onmouseover = function(){
			this.style.zIndex = 1000;
			this.style.backgroundColor = "#BC3B3A";
			this.style.color = '#fff';
			this.getElementsByTagName("span")[0].innerHTML = that._mouseoverText;
			arrow.style.borderColor = '#BC3B3A transparent transparent transparent';
		};

		div.onmouseout = function(){
			this.style.zIndex = 1;
			this.style.backgroundColor = "#fff";
			this.style.color = '#000';
			this.getElementsByTagName("span")[0].innerHTML = that._text;
			arrow.style.borderColor = '#fff transparent transparent transparent';
		};

		circle.appendChild(div);
		return circle;//当调用map.removeOverlay或者map.clearOverlays方法时,API会自动将initialize方法返回的DOM元素进行移除。
	};
	ComplexCustomOverlay.prototype.draw = function(){
		var map = this._map;
		var pixel = map.pointToOverlayPixel(this._point);

		this._circle.style.top = pixel.y - 5 + 'px';
		this._circle.style.left = pixel.x - 5 + 'px';
	};

	function createMap(){
		var mp = new BMap.Map("mapContainer", {enableMapClick:false,minZoom:11,maxZoom:20}); // 在百度地图容器中创建一个地图
		mp.centerAndZoom(new BMap.Point(123.38497,41.810947), 13); // 设定地图中心和坐标并将地图显示在地图容器中
		mp.setMapStyle({style:'light'});
		mp.enableKeyboard();
		mp.enableScrollWheelZoom(true);

		return mp;
	}

	var mp  = createMap();

	/**
	 * 回调函数必须提供 init(tableId, result.list)方法
	 * tableId ,用来显示的div的id
	 * result.list 列表的json数组
	 * */
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
			mp.clearOverlays();

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = creatLine(v);

					$liLine.appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		};

		var creatLine = function(v){

			var vill = v.village;
			var villageName = vill.villageName;
			var x = vill.x;
			var y = vill.y;
			var count = vill.count;
			var comment = villageName + "已完成订单" + count + "套";

			if(x && y && mp){
				var mytext = new ComplexCustomOverlay(new BMap.Point(x, y), villageName, comment); //控制标注地址和备注信息
				mp.addOverlay(mytext);
			}

			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.orderId));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

			var propertyArr = [
				["楼盘地址:", v.village.villageName, "grey"],
				["客户名:", v.customer.customerName, "grey"],
				["设计师:", v.designer, "grey"],
				["业务员:", v.salesman, "grey"],
				["面积:", v.houseArea, "blue"],
				["合同报价:", v.orderTotalPrice, "blue"],
				["折扣:", v.discount, "blue"],
				["签单时间:", v.contractTime, "grey"],
				["状态:", v.status, "grey"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

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
		};
	})();

	var _condArr = ['orderId', 'village', 'houseNumber', 'designer', 'salesman', 'signTimeDateRange', 'status'];

	var searcher = new Searcher();
	searcher.init( _condArr, "condList", api.decoration.pageDecorationOrderForCommon, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "DecorationOrderMapPostData");

	$('#mapContainer').height($(window).height() - $('#resultList').offset().top - 10).css('border', '1px solid #ddd');

	$(window).scroll(function(){
		$('#mapWrap').css('top', $(window).scrollTop() +  'px');
	});

});
    

