$(function(){
	var echar = echarts;
	var genderChart = "";
	var deptChart = "";
	var companyChart = "";
	var statusChart = "";
	var dutyChart = "";
	var deptTypeChart = "";

	//获得页面参数
	var urlParam = params['urlLoadParams'].company;
	var company;
	var server = "";

	if (api.flaskServer && config[api.flaskServer]) {
		server = config[api.flaskServer];
	} else {
		server = config.flaskServer;
	}

	if(urlParam == "all"){
		com.focusPage("#companyDiv").remove();
		getDom("All");
		company = 0;
	}else{
		com.focusPage("#allDiv").remove();
		getDom("");
		company = 1;
	}

	//男女比例
	drawingTableColumnar(genderChart, '人员性别分布', 'pie');
	getTableParams(genderChart, server + "library?api=system.userClass.userGender&company=" + company + "&mongo=communion", "gender", "count");

	//部门人数
	drawingTableColumnar(deptChart, '人员部门分布');
	getTableParams(deptChart, server + "library?api=system.userClass.userDept&company=" + company + "&mongo=communion", "deptName", "count");

	//人员公司分布
	drawingTableColumnar(companyChart, '人员公司分布');
	getTableParams(companyChart, server + "library?api=system.userClass.userCompany&mongo=communion", "company", "count");

	//人员员工总数
	drawingTableColumnar(statusChart, '人员员工总数');
	getTableParams(statusChart, server + "library?api=system.userClass.userStatus&company=" + company + "&mongo=communion", "status", "count");

	//人员职位分布
	drawingTableColumnar(dutyChart, '人员职位分布');
	getTableParams(dutyChart, server + "library?api=system.userClass.userDuty&company=" + company + "&mongo=communion", "duty", "count");

	//人员部门类型分布
	drawingTableColumnar(deptTypeChart, '人员部门类型分布');
	getTableParams(deptTypeChart, server + "library?api=system.userClass.userDeptType&company=" + company + "&mongo=communion", "deptTypeName", "count");

	//柱状图
	function drawingTableColumnar(chart, text){
		chart.setOption({
			title : {
				text: text
			},
			tooltip : {
				trigger: 'axis'
			},
			toolbox: {
				show : true,
				feature : {
					mark : {show: true},
					dataView : {show: true, readOnly: false},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
				{
					type : 'category'
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name:"数量",
					type:'bar'
				}
			]
		});
	}

	//饼状图
	function drawingTablePie(chart, text) {
		chart.setOption({
			title : {
				text: text
			},
			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left: 'left'
			},
			series : [
				{
					name: text,
					type: 'pie', //什么图标类型
					radius : '55%',
					center: ['50%', '60%'],
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		});
	}

	function getTableParams(chart, url, xparam, yparam) {
		var x=[];    //名称数组（实际用来盛放X轴坐标值）
		var y=[];    //数量数组（实际用来盛放Y坐标值）

		chart.showLoading();    //数据加载完之前先显示一段简单的loading动画

		$.ajax({
			type : "get",
			//       		async : true,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
			url : url,    //请求发送到Servlet处
			//       		data : {},
			dataType : "json",        //返回数据形式为json
			success : function(result) {
				//请求成功时执行该函数内容，result即为服务器返回的json对象
				if (result) {
					for(var i=0;i<result["data"].length;i++){
						x.push(result["data"][i][xparam]);    //挨个取出名称并填入类别数组
						y.push(result["data"][i][yparam]);
						//y.push({value:result["data"][i][yparam], name:result["data"][i][xparam]});
					}

					chart.hideLoading();    //隐藏加载动画
					chart.setOption({        //加载数据图表
						xAxis : [
							{
								data : x
							}
						],

						series : [
							{
								data: y
							}
						]
					});
				}
			},
			error : function(errorMsg) {
				//请求失败时执行该函数
				alert("图表请求数据失败!");
				chart.hideLoading();
			}
		});
		return [x, y]
	}

	function getDom(allFlag){
		genderChart = echar.init(document.getElementById('gender' + allFlag));
		deptChart = echar.init(document.getElementById('dept' + allFlag));
		companyChart = echar.init(document.getElementById('company' + allFlag));
		statusChart = echar.init(document.getElementById('status' + allFlag));
		dutyChart = echar.init(document.getElementById('duty' + allFlag));
		deptTypeChart = echar.init(document.getElementById('deptType' + allFlag));
	}
});