
jQuery(function($) {
	
	var personInfo = {
		cancellBtn: null,
		modal: null,
		personInfoItems: {},
		
		editFlag: false
	};

	var personInfoPostData = {};

	var qualityInfo = {"supervisor":"工程部监理", "chan":"铲大白工人", "putline":"放线小组", "waterwayCircuitPower":"水暖,电,力", "bricklay":"瓦工", "carpent":"木工", "oil":"油工", "cleaning":"保洁工"};
	var qualityIds = {"supervisor":"", "chan":"", "putline":"", "waterwayCircuitPower":"", "bricklay":"", "carpent":"", "oil":"", "cleaning":""};
	var qualityFlag = {"supervisor":false, "chan":false, "putline":false, "waterwayCircuitPower":false, "bricklay":false, "carpent":false, "oil":false, "cleaning":false};
	//取消按钮
	personInfo.cancelBtn = $("#cancelBtn");
	//保存按钮  并添加事件
	personInfo.deployedBtn = $("#deployedBtn").on("click", drawLineDeployed);
	//全局的DIV
	personInfo.personInfoModal = $("#personInfoModal");
	//post 是一个ajax,第一个API的路径,第二个API的条件,第三个成功的回调函数,第四个失败回调函数,第五个false为同步  true为异步
	com.post(api.ds.constructionInfo, {}, function(res){
		//绑定select标签,第一个是参数,第二个是option的标签ID 第三个值是循环的value的值
		$("#scheduleSearch").bindData(res.constructionSchedule, "key", "value", true);
	});
	//循环qualityInfo字典
	for(var qualityName in qualityInfo){
		//根据拼音查找员工名字  创建select标签中的查询方法
		var options = {};
		if(qualityName == "supervisor"){
			//给options赋值 duty是职位 工程部监理
			options["duty"] = qualityInfo[qualityName];
			//赋值给API路径
			queryUserNameUrl = api.personel.queryUserForNameByDuty;
		}else if(qualityName == "waterwayCircuitPower"){
			//交集查询
			queryUserNameUrl = api.personel.queryUserForNameByDutysAO;
			//根据,拆分成数组
			dutys = qualityInfo[qualityName].split(",");
			for(var i=0;i<dutys.length;i++){
				//根据数组 将所有字段后面拼接一个字  赋值给字典中
				options["dutysO["+i+"]"] = dutys[i]+"工";
			}
			//根据职位查找员工
			options["dutys[0]"] = "质检";
		}else{
			//联合查询
			//员工职位1
			options["dutys[0]"] = qualityInfo[qualityName];
			//员工职位2
			options["dutys[1]"] = "质检";
			//API地址
			queryUserNameUrl = api.personel.queryUserForNameByDutys;
		}
		//select标签的下拉框的样式  第一个参数为显示ID,第二个为API路径,第三个为前台输入的拼音,第四个为查询条件,第五个为返回的数组,第六个为数组中的KEY,第七个为数组中的value
		com.initChosen(qualityName + 'Quality', queryUserNameUrl, "pinyinName", options, "autoFillKeyValue", "key", "value");
	}
	
	var displayFunc  = (function(){
		//ID名,API分页查询的返回值
        var renderList = function(tableId,listData){
			//创建DIV
            var $tableWrap = $('#' + tableId);
            //创建一对UL并添加bootstrap的样式
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
			//如果返回值不为null
            if(listData && listData.length){
				//循环返回值
                $.each(listData,function(i, v){

                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
        	
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDeploy = $('<a></a>').addClass('btn btn-minier btn-primary').html('人员部署');

            var propertyArr = [
				//显示的信息类型,显示信息的数据,显示信息的颜色
               ["楼盘地址:", v.village.villageName + ' ' + v.houseNumber, "grey"],
               ["客户:", v.customer.customerName, "grey"],
               ["设计师:", v.designer, "grey"],
               ["面积:", v.houseArea, "blue"],
               ["创建时间:", v.createTime, "grey"],
               ["进度:", v.projectStatus, "green"],
               ["状态:", v.status, "red"],
           ];
            
           $.each(propertyArr, function (index,value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });

            $divBtnWrap.append($btnDeploy).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            //给人员部署添加点击事件
            $btnDeploy.click(function(){
				//v是循环分页查询数据的其中一条返回值
            	deployed(v);
            });
            
            return $liLine;
        };
      
        return {
			//数据显示框的ID,分页查询API的返回值
            init : function(tableId,listData){
				//创建DIV 并且内容为null
                $('#' + tableId).html(null);

                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
	
	var searcher = new Searcher();
	//查询的字段名称,查询框DIV的ID,API地址,成功回调函数,分页DIV的ID,保存历史查询的查询名
	searcher.init(["orderId", "designer", "salesman"], "condList", api.construction.pageDecorationOrderForConstruction, function(data){
		//resultList是显示数据的DIV,data是返回值
		displayFunc.init('resultList', data);
	}, "pagenation", "drawLinePersonPostData");
	
	function deployed(v){
		
		for(var qualityName in qualityInfo){

			//清除提示
			com.clearValidator("#"+qualityName+"Quality_chosen", true);
		}
		
		var options = {};
		//获取查询出来的订单编号
		options["construction.orderId"] = v.orderId;
		//通过订单编号获取工程信息中监理和质检人员名称
		com.post(api.construction.queryConstructionForWorkerNameByOrderId, options, function(res){
			
			var queryUserNameUrl = "";
			
			for(var qualityName in qualityInfo){
				//判断查询是否为空
				if(res.construction[qualityName+"QualityName"] == null){
					//向ID里面拼接 option标签
					com.updateChosen(qualityName + 'Quality', '', '');
				}else{
					//如果不为空  第一个值为要拼接元素的ID名,第二个为KEY值,第三个为显示的value值
					com.updateChosen(qualityName + 'Quality', res.construction[qualityName+"QualityId"], res.construction[qualityName+"QualityName"]);
				}
			}
			//将订单编号存入字典
			personInfoPostData.orderId = v.orderId;
			//显示隐藏框
			personInfo.personInfoModal.modal("show");
		});
	}

	function drawLineDeployed(){
		
		var options = {};

		for(var qualityId in qualityIds){
			//取出输入框中的值
			var $id = $('#' + qualityId + "Quality").val();
			
			if(!$id){
				//如果没有值 就显示提示信息 并返回false
				com.showTips($("#"+qualityName+"Quality_chosen"), "人员部署信息不能为空", true);
				return false;
			}
			//不为空 就将值 存入字典中
			options["construction." + qualityId + "QualityId"] = $id;
		}
		//将订单编号 存入字典中
		options["construction.orderId"] = personInfoPostData["orderId"];
		//调用更新API,将更新的值传入
		com.post(api.construction.updateConstructionByOrderId, options);
		//将动态模块 隐藏
		personInfo.personInfoModal.modal("hide");
	}
	
});

