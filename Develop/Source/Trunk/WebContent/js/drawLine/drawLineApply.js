	
jQuery(function($) {
	
	var drawLineApply = {
		saveBtn: null,
		cancellBtn: null,
		modal: null,
		drawLineApplyItems: {},
		
		drawLineGroup:null,
		drawLineDateCount:null,
		up : false,
		editFlag: false
	};
	//保存按钮   添加点击事件
	drawLineApply.saveBtn = $("#saveBtn").on("click", saveData);
	//取消按钮
	drawLineApply.cancelBtn = $("#cancelBtn");
	//日期模块的全局DIV
	drawLineApply.drawLineApplyModal = $("#drawLineApplyModal");
	//放线模块的全局DIV
	drawLineApply.drawLineModal = $("#drawLineModal");
	//放线信息ID  隐藏的input
	drawLineApply.drawLineApplyItems.dlId =  $("#dlId");
	//放线模块中的放线日期的input
	drawLineApply.drawLineApplyItems.actualDate =  $("#actualDate");
	//放线模块中 开始时间的input
	drawLineApply.drawLineApplyItems.startTime =  $("#startTime");
	//放线模块中  结束时间的input
	drawLineApply.drawLineApplyItems.endTime =  $("#endTime");
	//放线模块中的 放线小组input
	drawLineApply.drawLineApplyItems.drawLineGroup =  $("#drawLineGroup");

	com.post(api.data.queryDrawlineGroup, {}, function(res){
		if(res.drawLineGroups == null||res.drawLineGroups == ""){
			drawLineApply.up = true;
		}
		drawLineApply.drawLineGroup = res.drawLineGroups;
		//绑定select标签,第一个是参数,第二个是option的标签ID 第三个值是循环的value的值
		drawLineApply.drawLineApplyItems.drawLineGroup.bindData(res.drawLineGroups, 'gid', 'name');
	});
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDraw = $('<a></a>').addClass('btn btn-minier btn-yellow').html('放线');
            
            var propertyArr = [
               ["楼盘地址:", v.village + ' ' + v.houseNumber, "grey"],
               ["设计师:", v.designer, "grey"],
               ["面积:", v.houseArea, "blue"],
               ["申请人:", v.applayUser, "grey"],
               ["申请时间:", v.applayTime, "grey"],
               ["放线次数:", v.applayCount, "blue"],
               ["描述:", v.applayDes, "grey"],
           ];
            
           $.each(propertyArr, function (index,value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });

            $divBtnWrap.append($btnDraw).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnDraw.click(function(){
            	drawLine(v);
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
	//查询的字段名称,查询框DIV的ID,API地址,成功回调函数,分页DIV的ID,保存历史查询的查询名
	searcher.init(["orderId", "designer", "salesman"], "condList", api.drawline.pageDrawLineForPlan, function(data){
		//resultList是显示数据的DIV,data是返回值
		displayFunc.init('resultList', data);
	}, "pagenation","drawLineApplyPostData");
	//在查询DIV末尾添加一个申请信息的button标签(日期模块展示按钮)
	$("#condList").append('<button id="showDrawLineApplyInfos" style="marg" class="btn btn-xs btn-yellow btn-search">申请信息</button>');
	
	function drawLine(v){
		//清除提示
		com.clearValidator();
		//清空所有元素
		com.cleanItems(drawLineApply.drawLineApplyItems);
		//给隐藏标签赋值
		drawLineApply.drawLineApplyItems.dlId.val(v.dlId);
		//添加日期选择器   初始数值是v.applayTime   update使用当前输入框中的值更新日期时间选择器。
		drawLineApply.drawLineApplyItems.actualDate.datepicker('update', v.applayTime);
		//第一个下拉框的索引值 赋值0(不显示)
		drawLineApply.drawLineApplyItems.drawLineGroup.get(0).selectedIndex = 0;
		//展示动态模块
		drawLineApply.drawLineModal.modal("show");
		if(drawLineApply.up){
			bootbox.alert("无可用放线小组");
		}
	}
	
	function saveData(){
		//弹出确认框
		bootbox.confirm("确认提交申请吗？",function(res){
			if(res){
				//正则表达式验证
				if(com.validate("drawLineModal")){
					return;
				}
				//解析放线日期的value值 其中用-替换/ +  开始放线的时间 (日期+开始放线的具体时间)
				var start = Date.parse(drawLineApply.drawLineApplyItems.actualDate.val().replace("-","/") +" " +drawLineApply.drawLineApplyItems.startTime.val());
				//放线的日期+放线结束的具体时间
				var end = Date.parse(drawLineApply.drawLineApplyItems.actualDate.val().replace("-","/") +" " +drawLineApply.drawLineApplyItems.endTime.val());
				//如果解析返回的是NaN   或者开始时间小于等于结束时间  则提示
				if(start == NaN || end == NaN || start >= end){
					bootbox.alert("起始时间和结束时间非法");
					return;
				}
				var Group = drawLineApply.drawLineApplyItems.drawLineGroup.val();
				if(Group == null || Group == ''){
					bootbox.alert("放线小组不能为空");
					return;
				}
				var options ={
					//放线信息ID  隐藏的input标签
					"drawLine.dlId":drawLineApply.drawLineApplyItems.dlId.val(),
					//放线的开始日期
					"drawLine.actualDate":drawLineApply.drawLineApplyItems.actualDate.val(),
					//放线的开始时间
					"drawLine.startTime":drawLineApply.drawLineApplyItems.startTime.val(),
					//放线的结束时间
					"drawLine.endTime":drawLineApply.drawLineApplyItems.endTime.val(),
					//放线小组
					"drawLine.gid":drawLineApply.drawLineApplyItems.drawLineGroup.val()
				};
				//重置放线重新设置相关信息,将条件传入,回调函数
				com.post(api.drawline.resetDrawLine, options, function(res){
					//刷新页面所有条件,点击保存之后 刷新页面条件 重新载入
					com.showAlert(com.info, "操作成功");
					searcher.doSearch();
				});
				//隐藏动态框
				drawLineApply.drawLineModal.modal("hide");
			}else{
				return ;
			}
		});
	}
	//申请信息 按钮绑定点击事件
	$('#showDrawLineApplyInfos').click(function(){
		//展示日期模块
		drawLineApply.drawLineApplyModal.modal("show");
	});
	//获取同胞元素的焦点
	$('.date-picker').datepicker().next().on(ace.click_event, function(){
		//prev()方法获取同胞元素
		$(this).prev().focus();
	});
	//放线开始时间的选择器
	$('#startTime').timepicker({
		//可选时间分钟间隔   1为每一分钟一选
		minuteStep: 1,
		//是否显示秒字段
		showSeconds: false,
		//默认是false  true为12小时制  false为24小时制。
		showMeridian: false
	});
	//放线结束时间的选择器
	$('#endTime').timepicker({
		//可选时间分钟间隔   1为每一分钟一选
		minuteStep: 1,
		//是否显示秒字段
		showSeconds: false,
		//默认是false  true为12小时制  false为24小时制。
		showMeridian: false
	});
	//展示模态框  bootStrap
	drawLineApply.drawLineApplyModal.on('shown.bs.modal', function(e){

		initPlan();
	});
	
	function initPlan(){
		//销毁id日历，把日历回复到初始化前状态。
		$('#calendar').fullCalendar('destroy');
		//当前时间设置为当天
		$('#calendar').fullCalendar('today');
		//设置日历
		$('#calendar').fullCalendar({
			//
			buttonText: {
	            today: '今天', month: '月', week: '周', day: '日', prev: '上一月', next: '下一月'
			},
			//星期的全称 默认英文 从周日开始
			dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
			//星期的简写 默认英文简写 从周日开始
			dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
			//月份的全称  默认英文
			monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			//设置当一个日期下日程多的时候是否显示更多的来展示
			eventLimit: true,

			events: function(start, end, callback){
				//当前显示模块中第一个模块的时间
				var startTime = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " 00:00:00";
				//当前显示模块中最后一个模块的时间
				var endTime = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " 23:59:59";

				var options = {
					"drawLine.startTime": startTime,
					"drawLine.endTime": endTime,
				}
				//通过显示框时间查询
				com.post(api.drawline.countDrawLineByDate, options, function(res){
					//返回时间的放线信息
					drawLineApply.drawLineDateCount = res.drawLineDateCount;
					//必须创建events数组
					var events = [];
					//循环返回值
					for(var i in drawLineApply.drawLineDateCount){
						//将时间按-拆分成数组
						var s = i.split('-');
						var drawLineDateCount = drawLineApply.drawLineDateCount[i];
						
						for(var j in drawLineApply.drawLineDateCount[i]){
							
							var _ = drawLineDateCount[j];
							
							var event = {
								//显示的信息
								title: j + _ + "个",
								//显示在哪个时间框上
								start: new Date(s[0], s[1]-1, s[2]),
								allDay: true
							}
							//将数组存入数组中
							events.push(event);
						}
					}
					//调用回调函数
					callback(events);
				});
			}
		});
	}
});
