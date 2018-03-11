var materialOrderPreBalance = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	//页面表单里的数据
	materialOrderPreBalanceItems: {},
	caclTypeData: [{"id":"0", "name":"底价"}, {"id":"1", "name":"点位"}],
	
	editFlag: false,
};

var materialOrderPreBalancePostData = {};

jQuery(function($) {
	$('#fl-statement').statement("主材子订单", "订单信息列表");
	
	//materialOrderPreBalance.saveBtn = $("#saveBtn").on("click", saveData);
	materialOrderPreBalance.saveMalingBtn = $("#saveMalingBtn").on("click", saveMalingData);
	materialOrderPreBalance.cancelBtn = $("#cancelBtn");
	materialOrderPreBalance.modal = $("#materialOrderPreBalanceCalModal").on('show.bs.modal',function(e){
		com.clearValidator("#value", true);
		com.clearValidator();
	});
	materialOrderPreBalance.malingModal = $("#materialOrderMalingModal").on('show.bs.modal',function(e){
		com.clearValidator("#venderMaling", true);
		com.clearValidator();
	});
	
	materialOrderPreBalance.materialOrderPreBalanceItems.oldPoint = $("#oldPoint");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldBase = $("#oldBase");
	materialOrderPreBalance.materialOrderPreBalanceItems.caclType = $("#caclType");
	materialOrderPreBalance.materialOrderPreBalanceItems.value = $("#value");
	
	materialOrderPreBalance.materialOrderPreBalanceItems.malingTotal = $("#malingTotal");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldMaling = $("#oldMaling");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldVenderMaling = $("#oldVenderMaling");
	materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling = $("#venderMaling");
	
	materialOrderPreBalance.materialOrderPreBalanceItems.caclType.bindData(materialOrderPreBalance.caclTypeData, "id", "name");
	
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
                        var $liLine = $('<li></li>').addClass('item-orange clearfix');
                        var $h3 = $('<h3></h3>').addClass('oid');
                        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                        var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                        var $btnItem = $('<a></a>').addClass('btn btn-minier btn-yellow').html('子项');
                        //var $btnValue = $('<a></a>').addClass('btn btn-minier btn-success').html('结算值');
                        var $btnMaling = $('<a></a>').addClass('btn btn-minier btn-success').html('抹零');
                        var propertyArr = [
                            //侯骅峰于2017.4.7添加品牌 总价 券值 券信息 备注五个显示字段
                            ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
                            //添加品牌字段
                            ["品牌：",v.brand,"grey"],
                            ["客户名:", v.customer.name, "grey"],
                            ["业务员:", v.salesman.currentName, "grey"],
                            //["点位:", v.point, "blue"],
                            //["底价:", v.base, "blue"],
                            //添加总价字段
                            ["总价：",v.total,"blue"],
                            ["抹零:", v.maling, "blue"],
                            ["厂商抹零:", v.venderMaling, "blue"],
                            //添加券值
                            ["券值: ",v.coupon,"blue"],
                            //添加券信息
                            ["券信息: ",v.couponInfo ? v.couponInfo : '---',"grey"],
                            ["创建时间:", v.createTime, "green"],
                            ["补款时间:", v.fullpayTime , "green"],
                            //添加备注
                            ["备注：",v.comment ? v.comment : '---',"grey"],
                        ];
                        var $label = $('<label></label>');
                        var $input = $('<input>').attr({
                            "type": "checkbox",
                            "name": "msoIds",
                            "class": "ace ace-checkbox-2",
                            "msoId": v.mid,
                            "packageFlag": v.packageFlag,
                        }).val(v.arId);
                        var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.no);
                        //固定的写法？
                        $.each(propertyArr, function (index,value) {
                            var $liProperty = $('<li></li>');
                            $('<strong></strong>').html(value[0]).appendTo($liProperty);
                            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                            $liProperty.appendTo($ulProperty);
                        });

                        $label.append($input).append($span).appendTo($h3);
                        //子项
                        $btnItem.click(function(){
                            viewMaterialOrderBalanceDetailIndex(v.mid);
                        });
                        //结算值
                        //$btnValue.click(function(){
                        //    dialogMaterialOrderPreBalanceBacl(v);
                        //});
                        //抹零
                        $btnMaling.click(function(){
                            dialogMaterialOrderMaling(v);
                        });

                        $divBtnWrap.append($btnItem).append($btnMaling).appendTo($h3);

                        $liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
					});
				$ul.appendTo($tableWrap);
			}
		};
		
		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			}
		}
	})();
	
	var searcher = new Searcher();
//2017.4.7 hhf添加品牌查询条件
	searcher.init(["material_brand","orderId", "msoNo", "material_orderAddr", "material_salesman", "fullCollectTimeRange"], "condList", api.material.pageMaterialForPreBalance, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialOrderPreBalancePostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'prebalances').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('预结算').appendTo($adda);
    	$adda.click(function(){
    		preBalance();
    	});
    	var $passa = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'passbalances').css("margin", "0px 3px");
    	var $passi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($passa);
    	var $passspan = $('<span></span>').text('完结').appendTo($passa);
    	$passa.click(function(){
    		passBalance();
    	});
    	
    	return [$adda, $passa];
	});
	//点预结算
	function preBalance(){
		//复选框选中的对象
        var $inputs = $('input[name="msoIds"]:checked');
        if($inputs.length>0){
            var btn = $(this);
            var span = btn.find('span');
            btn.find('i').remove();
            var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
            span.prepend(loading);

            var options = {};
            var _packageFlag = 0;

            $.each($inputs, function(i, v){
                options["mids[" + i + "]"] = $(v).attr("msoId");

                $(v).attr("packageFlag") == 1 && (_packageFlag = 1);
            });

            var message = "<p>确定需要提交当前子订单的预结算处理吗?</p>";

            if(_packageFlag == "1"){
                message += "<p class='text-warning bigger-110 orange'><i class='icon-warning-sign'></i>当前存在套餐,是否已经设置完成计算点位?</p>";
            }

            bootbox.confirm(message, function(result) {
                if(result){
                    com.post(api.material.preBalanceMaterial, options, function(result){
                        btn.find('i').remove();
                        var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                        span.prepend(prepared);
                        searcher.doSearch();
                    },function () {
                        btn.find('i').remove();
                        var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                        span.prepend(prepared);
                    });
                }else{
                    btn.find('i').remove();
                    var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                    span.prepend(prepared);
				}
            });
		}else{
        	com.showAlert(com.warning,"请选择要进行预结算的订单");
		}
	}
	//点完结  后台将订单状态更改为完结
	function passBalance(){
		var $inputs = $('input[name="msoIds"]:checked');
		if($inputs.length>0){
            var btn = $(this);
            var span = btn.find('span');
            btn.find('i').remove();
            var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
            span.prepend(loading);

            var options = {};

            $.each($inputs, function(i, v){
                options["mids[" + i + "]"] = $(v).attr("msoId");
            });

            com.post(api.material.passBalanceMaterial, options, function(result){
                btn.find('i').remove();
                var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                span.prepend(prepared);
                //清楚数据显示
				$.each($inputs,function (i,v) {
					$(v).parent().parent().parent().remove();
                });
                com.showAlert(com.info,"完结成功");
                searcher.doSearch();
            },function () {
                btn.find('i').remove();
                var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                com.showAlert(com.warning,"完结失败");
                span.prepend(prepared);
            });
		}else{
            com.showAlert(com.warning,"请选择要进行完结的订单");
		}
	}
	
	
	//点子项按钮
	function viewMaterialOrderBalanceDetailIndex(mid){
		materialOrderPreBalancePostData["materialOrderPreBalance.msoId"] = mid;
		//ajax
		$("#materialOrderPreBalancePageContent").load(api.index.materialPreBalanceDetailIndex.url);
	}
	//点结算值按钮
	function dialogMaterialOrderPreBalanceBacl(v){
		
		materialOrderPreBalancePostData.msoId = v.mid;
		
		materialOrderPreBalance.materialOrderPreBalanceItems.value.val("");
		materialOrderPreBalance.materialOrderPreBalanceItems.caclType.bindData(materialOrderPreBalance.caclTypeData, "id", "name");
		//赋值到弹出框中的  原点数
		materialOrderPreBalance.materialOrderPreBalanceItems.oldPoint.val(v.point);
		//赋值到弹出框中的  原底价
		materialOrderPreBalance.materialOrderPreBalanceItems.oldBase.val(v.base);
		
		materialOrderPreBalance.modal.modal("show");
	}
	//点抹零按钮
	function dialogMaterialOrderMaling(v){
		
		materialOrderPreBalancePostData.msoId = v.mid;
		
		var maling = v.maling;
		var venderMaling = v.venderMaling;
		
		materialOrderPreBalance.materialOrderPreBalanceItems.malingTotal.val(utils.accAdd(maling, venderMaling));
		materialOrderPreBalance.materialOrderPreBalanceItems.oldMaling.val(maling);
		materialOrderPreBalance.materialOrderPreBalanceItems.oldVenderMaling.val(venderMaling);
		materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.val(0);
		
		materialOrderPreBalance.malingModal.modal("show");
	}
	//点击弹出框的保存按钮
	//function saveData(){
    //
     //   var options = {};
	//
	//	options["materialSubOrder.msoId"] = materialOrderPreBalancePostData.msoId;
	//	options["caclType"] = materialOrderPreBalance.materialOrderPreBalanceItems.caclType.val();
	//	//计算方式是底价
	//	if(materialOrderPreBalance.materialOrderPreBalanceItems.caclType.val() == 0){
	//
	//		var base = materialOrderPreBalance.materialOrderPreBalanceItems.value.val();
	//		var priceRex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
	//		//不符合正则表达式要求
	//		if(!(priceRex.test(base) && parseFloat(base) > 0)){
	//			materialOrderPreBalance.materialOrderPreBalanceItems.value.focus().select();
	//			com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.value, "底价输入内容格式错误!", true);
	//			return false;
	//		}
	//		options["materialSubOrder.base"] = base;
	//	}else{
	//		var point = materialOrderPreBalance.materialOrderPreBalanceItems.value.val();
	//		var postDiscountRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
	//		if(!postDiscountRex.test(point)){
	//			materialOrderPreBalance.materialOrderPreBalanceItems.value.focus().select();
	//			com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.value, "点位输入内容格式错误!", true);
	//			return false;
	//		}
	//
	//		options["materialSubOrder.point"] = point;
	//	}
	//
	//	com.post(api.material.updateMaterialSubOrderForPreBalancePT, options, function(result){
	//		searcher.doSearch();
	//
	//	});
	//
	//	materialOrderPreBalance.modal.modal("hide");
	//}

	function saveMalingData(){
		
		var malingTotal = materialOrderPreBalance.materialOrderPreBalanceItems.malingTotal.val();
		var venderMaling = materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.val();
		
		var venderMalingRex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
		if(!venderMalingRex.test(venderMaling)){
			materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.focus().select();
			com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling, "修改厂商抹零数据格式不正确!", true);
			return false;
		}
		
		if(parseFloat(venderMaling) > parseFloat(malingTotal)){
			materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.focus().select();
			com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling, "修改厂商抹零数据不能超过抹零总数!", true);
			return false;
		}
		
		var options = {};
		
		options["material.mid"] = materialOrderPreBalancePostData.msoId;
		//抹零总数减去厂商抹零
		options["material.maling"] = utils.accSub(malingTotal, venderMaling);
		options["material.venderMaling"] = venderMaling;
		
		com.post(api.material.updateMaterialForMaling, options, function(result){
			searcher.doSearch();
		});
		
		materialOrderPreBalance.malingModal.modal("hide");
	}
});
