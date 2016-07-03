var personInfo = {
	cancellBtn: null,
	modal: null,
	personInfoItems: {},
	
	editFlag: false
};

var personInfoPostData = {};

var qualityInfo = {"supervisor":"工程部监理", "chan":"铲大白工人", "putline":"放线小组", "waterwayCircuitPower":"水暖,电,力", "bricklay":"瓦工", "carpent":"木工", "oil":"油工", "cleaning":"保洁工"};
var qualityIds = {"supervisor":"", "chan":"", "putline":"", "waterwayCircuit":"", "bricklay":"", "carpent":"", "oil":"", "cleaning":""};
var qualityFlag = {"supervisor":false, "chan":false, "putline":false, "waterwayCircuitPower":false, "bricklay":false, "carpent":false, "oil":false, "cleaning":false};

jQuery(function($) {
	
	personInfo.cancelBtn = $("#cancelBtn");
	personInfo.deployedBtn = $("#deployedBtn").on("click", drawLineDeployed);
	personInfo.personInfoModal = $("#personInfoModal");
	
	var personInfoSearchOpts = {
		url: api.construction.pageDecorationOrderByPersonInfo,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: personInfo.listGrid,
		items: [
	        {label:"订单编号",id:"searchOrderId",name:"orderId",type:"text"},
			{label:"楼盘",id:"searchVillage",name:"village",type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
			{label:"楼号",id:"searchHouseNum",name:"houseNumber",type:"text"},
			{label:"面积",id:"searchHouseArea",name:"houseArea",type:"text",op:"eq"},
			{label:"业务员",id:"searchSalesman",name:"salesman",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":""}},
			{label:"设计师",id:"searchDesigner",name:"designer",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":"设计师"}},
		]
	};
	$("#personInfoSearchDiv").flSearch(personInfoSearchOpts);
	
	com.post(api.ds.constructionInfo, {}, function(res){
		$("#scheduleSearch").bindData(res.constructionSchedule, "key", "value", true);
	});
	
	for(var qualityName in qualityInfo){
		
		var options = {};
		if(qualityName == "supervisor"){
			options["duty"] = qualityInfo[qualityName];
			queryUserNameUrl = api.personel.queryUserForNameByDuty;
		}else if(qualityName == "waterwayCircuitPower"){
			queryUserNameUrl = api.personel.queryUserForNameByDutysAO;
			dutys = qualityInfo[qualityName].split(",");
			for(var i=0;i<dutys.length;i++){
				options["dutysO["+i+"]"] = dutys[i]+"工";
			}
			options["dutys[0]"] = "质检";
		}else{
			options["dutys[0]"] = qualityInfo[qualityName];
			options["dutys[1]"] = "质检";
			queryUserNameUrl = api.personel.queryUserForNameByDutys;
		}
		
		if(!qualityFlag[qualityName]){
			initChange(qualityName, queryUserNameUrl, options);
			qualityFlag[qualityName] = true;
		}else{
			var id = "#" + qualityName + "Quality";
			$(id).html('<option value="">&nbsp;</option>').trigger("chosen:updated");
		}
	}
	
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

            var $btnDeploy = $('<a></a>').addClass('btn btn-minier btn-primary').html('人员部署');
            
            var propertyArr = [
               ["楼盘地址:", v.village + ' ' + v.houseNumber, "grey"],
               ["客户:", v.customer.customerName, "grey"],
               ["设计师:", v.designer, "grey"],
               ["面积:", v.houseArea, "blue"],
               ["创建时间:", v.createTime, "grey"],
               ["进度:", v.schedule, "green"],
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
            
            $btnDeploy.click(function(){
            	deployed(v);
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
	
	searcher.init(["orderId", "designer", "salesman"], "condList", api.construction.pageDecorationOrderByPersonInfo, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "drawLinePersonPostData");
	
	function deployed(v){
		
		for(var qualityName in qualityInfo){
			com.clearValidator("#"+qualityName+"Quality_chosen", true);
		}
		
		var options = {};
		options["constructionSchedule.orderId"] = v.orderId;
		
		com.post(api.construction.queryConstructionScheduleForWorkerNameByOrderId, options, function(res){
			
			var queryUserNameUrl = "";
			
			for(var qualityName in qualityInfo){
				
				if(res.constructionSchedule[qualityName+"QualityName"] == null){
					$("#"+qualityName+"Quality_chosen span")[0].textContent = "";
				}else{
					$("#"+qualityName+"Quality_chosen span")[0].textContent = res.constructionSchedule[qualityName+"QualityName"]+"-"+res.constructionSchedule[qualityName+"QualityId"];
				}
				
				qualityIds[qualityName] = res.constructionSchedule[qualityName+"QualityId"];
				
				$("#"+qualityName+"Quality_chosen").css("width", "150px");
			}
			
			personInfoPostData.orderId = v.orderId;
			
			personInfo.personInfoModal.modal("show");
		});
	}

	function drawLineDeployed(){
		
		for(var qualityName in qualityInfo){
			
			var qualityNameInput = $("#"+qualityName+"Quality_chosen span");
			
			console.log(qualityNameInput[0].textContent);
			console.log(qualityNameInput[0].textContent.trim() == "");
			
			if(qualityNameInput[0].textContent.trim() == ""){
				com.showTips($("#"+qualityName+"Quality_chosen"), "人员部署信息不能为空", true);
				
				return false;
			}
		}
		
		var options = {};
		
		for(var qualityId in qualityIds){
			options["constructionSchedule."+qualityId+"QualityId"] = qualityIds[qualityId];
		}
		options["constructionSchedule.orderId"] = personInfoPostData["orderId"];
		
		com.post(api.construction.updateConstructionScheduleByOrderId, options);
		
		personInfo.personInfoModal.modal("hide");
	}
	
	function initChange(initId, queryElementsUrl, options){
		
		id = "#" + initId + "Quality";
		var chosenNameId = id+"_chosen input";
		
		$(id).chosen({
		    allow_single_deselect: true
		});
		
		$(id).on("change", function(){
			qualityIds[initId] = $("#"+$(this).attr("id")).val();
		});
		
		$(chosenNameId).on("change", function(){
			qualityIds[initId] = $("#"+$(this).attr("id")).val();
		});
		
		$(chosenNameId).unbind("input").bind("input", function(){
			var _id = "#"+$(this).parents('.chosen-container').attr("id").split("_")[0];
			var _chosenNameId = "#"+$(this).parents('.chosen-container').attr("id")+" input";
			
			var autoFileSearchValue = $(_chosenNameId).val();
			options["pinyinName"] = autoFileSearchValue;
			com.post(queryElementsUrl, options, function(res){
				if(res.errorCode == 0){
					var html1 = '<option value="">&nbsp;</option>';
					if(res.autoFillKeyValue != null){
						for(var i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}
					
					$(_id).html(html1).trigger("chosen:updated");
					$(_chosenNameId).val(autoFileSearchValue);
				}
			});
		});
	}
	
});

