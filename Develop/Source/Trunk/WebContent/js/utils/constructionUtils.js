var constructionUtils = {
	scheduleInfos: {"铲大白":[10, "progress-bar-primary"], "放线":[10, "progress-bar-warning"], "水电力":[20, "progress-bar-danger"], "瓦工":[10, "progress-bar-inverse"], "地面找平":[10, "progress-bar-primary"], "木工":[10, "progress-bar-purple"], "油工":[10, "progress-bar-pink"], "水电验收":[10, "progress-bar-danger"], "保洁":[10, "progress-bar-success"]},
	createDecorationOrderCondition: function(listGrid, queryUrl, searchDivId, postParms, postDataName, condition){
		
		var conditions = [];
		var _postParms = {};
		
		if(condition == 0){
			return conditions;
		}
		if((condition & 1) == 1){ // 订单编号
			conditions.push({label:"订单号", id:"orderId", name:"orderId", type:"text"});
		}
		if((condition & 2) == 2){ // 楼盘地址
			conditions.push({label:"楼盘地址", id:"village", name:"village", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin});
		}
		if((condition & 4) == 4){ // 楼号
			conditions.push({label:"楼号", id:"houseNumber",name:"houseNumber",type:"text"});
		}
		if((condition & 8) == 8){ // 设计师
			conditions.push({label:"设计师", id:"designer", name:"designer", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":"设计师"}});
		}
		if((condition & 16) == 16){ // 业务员
			conditions.push({label:"业务员", id:"salesman", name:"salesman", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":""}});
		}
		if((condition & 32) == 32){ // 监理
			conditions.push({label:"监理", id:"supervisor", name:"supervisor", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":"监理"}});
		}
		if((condition & 64) == 64){ // 进度
			conditions.push({label:"进度", id:"schedule", name:"schedule", type:"select"});
		}
		if((condition & 128) == 128){ // 分配状态
			conditions.push({label:"分配状态", id:"allocationWorkerFlag", name:"allocationWorkerFlag", type:"select"});
		}
		if((condition & 256) == 256){ // 分配状态
			conditions.push({label:"验收状态", id:"acceptanceFlag", name:"acceptanceFlag", type:"select"});
		}
		if((condition & 512) == 512){ // 分配状态
			conditions.push({label:"完工状态", id:"projectStatusFlag", name:"projectStatus", type:"select"});
		}
		
		for(var k in postParms){
			_postParms[k] = postParms[k];
		}
		
		$("#" + searchDivId).flSearch({
			url: queryUrl,
			postDataName: postDataName,
			postParmas: _postParms,
			listgrid: listGrid,
			items: conditions
		});
		
		if(condition & 64 == 64){
			com.post(api.ds.constructionInfo, {"timestamp": new Date().getTime()}, function(res){
				$("#schedule").bindData(res.constructionSchedule, "key", "value", true);
			});
		}
		if(condition & 128 == 128){
			$("#allocationWorkerFlag").bindData([{"key": "notAllocationed", "value": "未分配工人"}, {"key": "allocationed", "value": "已分配工人"}], "key", "value", false);
		}
		if(condition & 256 == 256){
			$("#acceptanceFlag").bindData([{"key": "notAcceptanced", "value": "未验收"}, {"key": "acceptanced", "value": "已验收"}], "key", "value", false);
		}
		if(condition & 512 == 512){
			$("#projectStatusFlag").bindData([{"key": "未完工", "value": "未完工"}, {"key": "已完工", "value": "已完工"}], "key", "value", false);
		}
	}, scheduleInit: function(cellvalue, options, rowdata){
		var result = '';
		var _result = "";
		var projectStatus = rowdata.projectStatus;
		var flag = false;
		
		result += '<div class="progress" style="margin-bottom: 0px;" data-percent="' + rowdata.projectStatus + '">';
		
		var scheduleInfos = constructionUtils.scheduleInfos;
		
		for(var schedule in scheduleInfos){
			scheduleInfo = constructionUtils.scheduleInfos[schedule];
			_result += '<div style="width: ' + scheduleInfo[0] + '%;" class="progress-bar ' + scheduleInfo[1] + '"></div>';
			if(schedule == projectStatus){
				flag = true;
				break;
			}
		}
		
		if(flag){
			result += _result;
		}
		
		result += '</div>';
		
		return result;
	}
}