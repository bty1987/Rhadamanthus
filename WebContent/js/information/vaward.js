
jQuery(function($) {
	
	var vaward = {
		
		cancelBtn : com.focusPage("#cancelBtn"),
			
		modals: {
			VawardItemModal : com.focusPage("#VawardItemModal")
		},	
		items : {
			vawards : com.focusPage("#vawards"),
		    name : com.focusPage("#name"),
		    price : com.focusPage("#price"),
		    num : com.focusPage("#num")
		},
		
		btns: {
		    print: com.focusPage("#printBtn"),
		},

		vawardPostData : {
			tno: params.tno
		}
	};
	
	com.post(api.information.queryVawardByNo, {"vaward.no": vaward.vawardPostData.tno}, function(res){

		var vawards = res.vawards;

		for(var i = 0; i < vawards.length; i++){
			var _vaward = vawards[i];
			
			addvawardForDiv(vaward.items.vawards, _vaward);
		}
	});
	
	function addvawardForDiv(_vawards, _vaward){

		var pricingSpan = $("<div></div>").addClass("pricing-span").css("margin-right", "10px").attr("id", "pricing_" + _vaward.vaid).prependTo(_vawards);
		var widgetBox = $("<div></div>").addClass("widget-box pricing-box-small").appendTo(pricingSpan);

		var widgetHeader = $("<div></div>").addClass("widget-header").appendTo(widgetBox);
		var widgetHeaderH5 = $("<h5></h5>").addClass("bigger lighter").appendTo(widgetHeader);

		widgetHeader.addClass("header-color-orange");
		widgetHeaderH5.text("奖品信息");
		
		var widgetBody = $("<div></div>").addClass("widget-body").appendTo(widgetBox);
		var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);
		var ul = $("<ul></ul>").addClass("list-unstyled list-striped pricing-table").appendTo(widgetMain);
		var nameLi = $("<li></li>").appendTo(ul);
		var nameSpan = $("<span></span>").attr("id", "vawardName_" + _vaward.vaid).text(_vaward.name).appendTo(nameLi);
		var moneyLi = $("<li></li>").text("价格:").appendTo(ul);
		var moneySpan = $("<span></span>").attr("id", "price_" + _vaward.vaid).text(_vaward.price).appendTo(moneyLi);
		var numLi = $("<li></li>").text("数量:").appendTo(ul);
		var numSpan = $("<span></span>").attr("id", "num_" + _vaward.vaid).text(_vaward.num).appendTo(numLi);
		var unitLi = $("<li></li>").text("单位:").appendTo(ul);
        var unitSpan = $("<span></span>").attr("id", "unit_" + _vaward.vaid).text(_vaward.unit).appendTo(unitLi);
		
		var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);
		var deleteBtn = $("<span></span>").addClass("ui-icon ui-icon-trash").attr("id", "delete_" + _vaward.vaid).appendTo(uiPgDiv);
		
		var selectL = $("<label></label>").addClass("pull-right").appendTo(uiPgDiv);
		var selectC = $("<input type='checkbox'></input>").addClass("ace ace-checkbox-2 print").attr("id", "select_" + _vaward.vaid).attr({"data-name": _vaward.name, "data-num": _vaward.num, "data-unit": _vaward.unit}).appendTo(selectL);
		var selectS = $("<span></span>").addClass("lbl").appendTo(selectL);

		deleteBtn.on("click", function(){
			deleteVaward( _vaward.vaid, _vaward.name);
		});
	}
	
	function deleteVaward(vaid, vawardName){
		
		com.showConfirm("是否需要删除" + vawardName + "活动物品?", function(result) {

			com.post(api.information.deleteVaward, {"vaward.vaid": vaid}, function(res){
				com.showAlert(com.info, "操作成功");

				com.focusPage("#pricing_" + vaid).remove();
			});
		});
	}
	
	vaward.btns.print.on("click", function(){

	    params.vawards = [];
	    
	    var items = com.focusPage(".print:checked", "#vawards");
	    
	    if(!items || items.length == 0){
	        com.showAlert(com.warning, "请选择奖品");
	        return false;
	    }
	    
	    items.each(function(i, v){
	        var e = $(v).data();
	        params.vawards.push({"name": e.name, "num": e.num, "unit": e.unit});
	    });
	    
	    com.popup("大活动奖品", "/views/information/vaward2print.html", null, null, true);
	});
	
});
