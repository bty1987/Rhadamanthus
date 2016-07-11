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

jQuery(function($) {
	
	personInfo.cancelBtn = $("#cancelBtn");
	personInfo.deployedBtn = $("#deployedBtn").on("click", drawLineDeployed);
	personInfo.personInfoModal = $("#personInfoModal");
	
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
		
		com.initChosen(qualityName + 'Quality', queryUserNameUrl, "pinyinName", options, "autoFillKeyValue", "key", "value");
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
					com.updateChosen(qualityName + 'Quality', '', '');
				}else{
					com.updateChosen(qualityName + 'Quality', res.constructionSchedule[qualityName+"QualityId"], res.constructionSchedule[qualityName+"QualityName"]);
				}
			}
			
			personInfoPostData.orderId = v.orderId;
			
			personInfo.personInfoModal.modal("show");
		});
	}

	function drawLineDeployed(){
		
		var options = {};
		
		for(var qualityId in qualityIds){
			
			console.log(qualityId);
			
			var $id = $('#' + qualityId + "Quality").val();
			
			if(!$id){
				com.showTips($("#"+qualityName+"Quality_chosen"), "人员部署信息不能为空", true);
				return false;
			}
			
			options["constructionSchedule." + qualityId + "QualityId"] = $id;
		}
		options["constructionSchedule.orderId"] = personInfoPostData["orderId"];
		
		com.post(api.construction.updateConstructionScheduleByOrderId, options);
		
		personInfo.personInfoModal.modal("hide");
	}
	
});

