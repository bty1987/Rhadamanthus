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
	com.focusPage('#fl-statement').statement("主材子订单", "订单信息列表");

	//materialOrderPreBalance.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	materialOrderPreBalance.saveMalingBtn = com.focusPage("#saveMalingBtn").on("click", saveMalingData);
	materialOrderPreBalance.cancelBtn = com.focusPage("#cancelBtn");
	materialOrderPreBalance.modal = com.focusPage("#materialOrderPreBalanceCalModal").on('show.bs.modal',function(e){
		com.clearValidator("#value", true);
		com.clearValidator();
	});
	materialOrderPreBalance.malingModal = com.focusPage("#materialOrderMalingModal").on('show.bs.modal',function(e){
		com.clearValidator("#venderMaling", true);
		com.clearValidator();
	});

	materialOrderPreBalance.materialOrderPreBalanceItems.oldPoint = com.focusPage("#oldPoint");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldBase = com.focusPage("#oldBase");
	materialOrderPreBalance.materialOrderPreBalanceItems.caclType = com.focusPage("#caclType");
	materialOrderPreBalance.materialOrderPreBalanceItems.value = com.focusPage("#value");

	materialOrderPreBalance.materialOrderPreBalanceItems.malingTotal = com.focusPage("#malingTotal");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldMaling = com.focusPage("#oldMaling");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldVenderMaling = com.focusPage("#oldVenderMaling");
	materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling = com.focusPage("#venderMaling");

	materialOrderPreBalance.materialOrderPreBalanceItems.caclType.bindData(materialOrderPreBalance.caclTypeData, "id", "name");

	function buildMaterialPreBalanceLineprops() {

		return [{
			type: "checkbox",
			field: "msoId",
			name: "msoIds",
			prop: "arId",
			clazz: "ace ace-checkbox-2"
		}, {
			field: "house.village",
			name: "楼盘地址",
			prop: function(v) { return v.house.village.name + " " + v.house.houseNumber; },
			clazz: "grey"
		}, {
			field: "brand",
			name: "品牌",
			prop: "brand",
			clazz: "grey"
		}, {
			field: "customer.name",
			name: "客户名",
			prop: "customer.name",
			clazz: "grey"
		}, {
			field: "salesman.currentName",
			name: "业务员",
			prop: "salesman.currentName",
			clazz: "grey"
		}, {
			field: "total",
			name: "总价",
			prop: "total",
			clazz: "blue"
		}, {
			field: "maling",
			name: "抹零",
			prop: "maling",
			clazz: "blue"
		}, {
			field: "venderMaling",
			name: "厂商抹零",
			prop: "venderMaling",
			clazz: "blue"
		}, {
			field: "coupon",
			name: "券值",
			prop: "coupon",
			clazz: "blue"
		}, {
			field: "couponInfo",
			name: "券信息",
			prop: function(v) { return v.couponInfo ? v.couponInfo : '---'; },
			clazz: "grey"
		}, {
			field: "createTime",
			name: "创建时间",
			prop: "createTime",
			clazz: "green"
		}, {
			field: "fullpayTime",
			name: "补款时间",
			prop: "fullpayTime",
			clazz: "green"
		}, {
			field: "comment",
			name: "备注",
			prop: function(v) { return v.comment ? v.comment : '---'; },
			clazz: "grey"
		}];
	}

	function buildMaterialPreBalanceLinebtns() {

		return {
			item: {
				name: "子项",
				clazz: "btn-primary",
				handle: function(v) {
					viewMaterialOrderBalanceDetailIndex(v.mid);
				}
			},
			maling: {
				name: "抹零",
				clazz: "btn-warning",
				handle: function(v) {
					dialogMaterialOrderMaling(v);
				}
			}
		};
	}

	function buildMaterialPreBalanceButtons() {

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'prebalances').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('预结').appendTo($adda);
		$adda.click(function() {
			preBalance();
		});
		var $passa = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'passbalances').css("margin", "0px 3px");
		var $passi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($passa);
		var $passspan = $('<span></span>').text('完结').appendTo($passa);
		$passa.click(function() {
			passBalance();
		});

		return [$adda, $passa];
	}

	var searcher = new Searcher();

	searcher.set("condList", "pagenation", "resultList", api.material.pageMaterialForPreBalance, null, ["material-orderId", "material-no", "material-village", "material-salesman", "material-brand", "material-fullpayTime"], "materialOrderPreBalancePostData", null, false, buildMaterialPreBalanceButtons);
	searcher.line("no", buildMaterialPreBalanceLineprops(), buildMaterialPreBalanceLinebtns()).render();

	//点预结
	function preBalance(){
		//复选框选中的对象
        var $inputs = com.focusPage('input[name="msoIds"]:checked');
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

            var message = "<p>确定需要提交当前子订单的预结处理吗?</p>";

            if(_packageFlag == "1"){
                message += "<p class='text-warning bigger-110 orange'><i class='icon-warning-sign'></i>当前存在套餐,是否已经设置完成计算点位?</p>";
            }

            com.showConfirm(message, function () {
                com.post(api.material.preBalanceMaterial, options, function (result) {
                    btn.find('i').remove();
                    var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                    span.prepend(prepared);
                    searcher.doSearch();
                }, function () {
                    btn.find('i').remove();
                    var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                    span.prepend(prepared);
                    com.showAlert(com.warning, "存在未处理审批信息");
                });
            });
        } else {
            com.showAlert(com.warning, "请选择要进行预结的订单");
        }
	}
	//点完结  后台将订单状态更改为完结
	function passBalance(){
		var $inputs = com.focusPage('input[name="msoIds"]:checked');
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
		com.focusPage("#materialOrderPreBalancePageContent").load(api.index.materialPreBalanceDetailIndex.url);
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
