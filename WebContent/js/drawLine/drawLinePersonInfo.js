
jQuery(function($) {
	
	var personInfo = {
		cancellBtn: null,
		modal: null,
		personInfoItems: {},
		
		editFlag: false
	};

	var personInfoPostData = {};

	var qualityInfo = {"supervisor":"工程部监理"};
	var qualityIds = {"supervisor":""};

	personInfo.cancelBtn = $("#cancelBtn");

	personInfo.deployedBtn = $("#deployedBtn").on("click", drawLineDeployed);

	personInfo.personInfoModal = $("#personInfoModal");

	com.post(api.ds.construction, {}, function(res){
		$("#scheduleSearch").bindData(res.constructionSchedule, "key", "value", true);
	});

	for(var qualityName in qualityInfo){
		var options = {};

		if(qualityName == "supervisor"){
			options["duty"] = qualityInfo[qualityName];
			options["user.status"] = 0;
			queryUserNameUrl = api.personel.queryUserForNameByDuty;
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
               ["楼盘地址:", v.house.village.name + ' ' + v.house.houseNumber, "grey"],
               ["客户:", v.customer.name, "grey"],
               ["设计师:", v.designer.userName, "grey"],
               ["面积:", v.house.buildArea, "blue"],
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
	searcher.init(["c_orderId", "c_designer", "c_salesman"], "condList", api.construction.pageDecorationForConstruction, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "drawLinePersonPostData");
	
	function deployed(v){
		
		for(var qualityName in qualityInfo){
			com.clearValidator("#"+qualityName+"Quality_chosen", true);
		}
		
		var options = {};
		options["construction.orderId"] = v.orderId;
		com.post(api.construction.queryConstructionForWorkerNameByOrderId, options, function(res){
			
			var queryUserNameUrl = "";
			
			for(var qualityName in qualityInfo){
				if(res.construction[qualityName+"QualityName"] == null){
					com.updateChosen(qualityName + 'Quality', '', '');
				}else{
					com.updateChosen(qualityName + 'Quality', res.construction[qualityName+"QualityId"], res.construction[qualityName+"QualityName"]);
				}
			}
			personInfoPostData.orderId = v.orderId;
			personInfo.personInfoModal.modal("show");
		});
	}

	function drawLineDeployed(){
		
		var options = {};

		for(var qualityId in qualityIds){
			var $id = $('#' + qualityId + "Quality").val();
			
			if(!$id){
				com.showTips($("#"+qualityId+"Quality_chosen"), "人员部署信息不能为空", true);
				return false;
			}
			options["construction." + qualityId + "QualityId"] = $id;
		}

		options["construction.orderId"] = personInfoPostData["orderId"];

		com.post(api.construction.updateConstructionByOrderId, options);

		personInfo.personInfoModal.modal("hide");
	}
	
});

