var approvalTrack = {
	postParam: {},
};

jQuery(function($) {
	
	com.post(api.ds.approvalType, {"timestamp": new Date().getTime()}, function(res){
		approvalTrack.approvalType = res.approvalType;
		
		approvalTrack.approvalTypeData = {};
		
		for(var i=0;i<approvalTrack.approvalType.length;i++){
			var _ = approvalTrack.approvalType[i];
			approvalTrack.approvalTypeData[_["key"]] = _["value"];
		}
	}, null, false);
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(approvalTrack.approvalTypeData[v.type]));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPass = $('<a></a>').addClass('btn btn-minier btn-success').html('通过');
            var $btnRefuse = $('<a></a>').addClass('btn btn-minier btn-danger').html('拒绝');

            var propertyArr = [
                ["申请人:", v.senderName, "grey"],
                ["提交时间:", v.createTime, "grey"],
                ["审批时间:", v.approvalTime, "grey"],
                ["状态:", v.status == 0 ? "等待" : (v.status == 1 ? "通过" : "拒绝"), "red"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            
            var $content = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').append($('<li></li>').append($('<strong></strong>').append($('<b></b>').text(v.contents).addClass("grey"))));
            
            if(v.status == 0){
            	$divBtnWrap.append($btnPass).append($btnRefuse).appendTo($h3);
            }
            
            $liLine.append($h3).append($ulProperty).append($content);
            
            $btnPass.click(function(){
            	approveApproval(v.aid);
            });
            
            $btnRefuse.click(function(){
            	refuseApproval(v.aid);
            });
            
            return $liLine;
        };
      
        return {
            init : function(tableId, listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
	
	var searcher = new Searcher();

	searcher.init(["userName", "approvalType"], "condList", api.approval.pageApprovalByReceiveId, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "approvalTrackPostData");
	
	function approveApproval(aId){
		
		var options = {
			"approval.aid": aId,
		}
		
		com.post(api.approval.approveApproval, options, function(res){
			searcher.doSearch();
		});
	}

	function refuseApproval(aId){
		
		var options = {
			"approval.aid": aId,
		}
		
		com.post(api.approval.refuseApproval, options, function(res){
			searcher.doSearch();
		});
	}

});
