
jQuery(function($) {
	
	$('#fl-statement').statement("主材订单", "型号信息");
	
	var options = {};
	var _options = {};
	var url = api.material.queryMaterialSubOrderItemByMsoId;
	var refundUrl = api.material.queryMaterialSubOrderRefundByMsoId;
	var _arr = [];
	var flag = 0;
	options["materialSubOrderItem.msoId"] = params['materialSubOrder.msoId'];
	_options["materialSubOrderRefund.msoId"] = params['materialSubOrder.msoId'];

    if(params['materialOrderPostBalance.type'] == 1 || params['materialOrderPostBalance.type'] == 2){
        _options['idents[0]'] = params['idents[0]'];
        com.post(refundUrl,_options,function (_data) {
            displayFunc.init('resultList',_data.materialSubOrderRefunds);
        });
	}else if(params['materialOrderPostBalance.type'] == 0){
	       		com.post(url, options, function(data){
	        	createArr(data.materialSubOrderItems);
	        	displayFunc.init('resultList',_arr);
        });
        	com.post(refundUrl,_options,function (_data) {
            createArr(_data.materialSubOrderRefunds);
		 	displayFunc.init('resultList',_arr);
        });
	}


	function createArr(data) {

		$.each(data,function (index,val) {
            if(_arr.length == 0){
                _arr.push(val);
            }else{
                for(var a = 0;a < _arr.length; a++){
                	if(val.packageName == ""){
                        if(val.materialModelName == _arr[a].materialModelName && val.materialModelNo == _arr[a].materialModelNo){
                            _arr[a].num = utils.accAdd(val.num,_arr[a].num);
                            _arr[a].total = utils.accAdd(val.total,_arr[a].total);
                            break;
                        }else if(val.materialModelName != _arr[a].materialModelName ||  val.materialModelNo != _arr[a].materialModelNo){
                            flag ++;
                        }
					}else{
                		    if(val.packageName == _arr[a].packageName && val.isLeaf == false && _arr[a].isLeaf == false){
                                _arr[a].total = utils.accAdd(val.total,_arr[a].total);
                                break;
							}
                            if(val.materialModelName == _arr[a].materialModelName && val.materialModelNo == _arr[a].materialModelNo && val.packageName == _arr[a].packageName){
                                _arr[a].num = utils.accAdd(val.num,_arr[a].num);
                                _arr[a].total = utils.accAdd(val.total,_arr[a].total);
                                break;
                            }else if(val.materialModelName != _arr[a].materialModelName ||  val.materialModelNo != _arr[a].materialModelNo || val.packageName != _arr[a].packageName){
                                flag ++;
                            }
					}

                }
                if(flag == _arr.length){
                    _arr.push(val);
                }
                flag = 0;
            }
        });

    }

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

					var propertyArr = [];
					
					if(v.level == 0 && v.isLeaf == true){

						$h3.append($('<small></small>').addClass('blue').html(v.materialModelName));

						propertyArr = [
							["型号:", v.materialModelNo, "grey"],
							["品类:", v.materialTypeName, "grey"],
							["品牌:", v.materialBrandName, "grey"],
							["单位:", v.measurementUnitName, "grey"],
							["折扣价:", v.salePrice, "blue"],
							["售价:", v.price, "blue"],
							["数量:", v.num, "green"],
							["总价:", v.total, "green"],
							["结算值:", v.prePoint, "grey"],
							["说明:", v.des, "grey"],
						];
					}else if(v.level == 0 && v.isLeaf == false){

						$h3.append($('<small></small>').addClass('blue').html("套餐 " + v.packageName));
						if(v.prePoint!=null){
                            propertyArr = [
                                ["总价:", v.total, "green"],
                                ["结算值:", v.prePoint, "grey"],
                            ];
						}else if(v.prePoint == null){
                            propertyArr = [
                                ["总价:", v.total, "green"],
                            ];
						}

					}else{
						//materialOrderPostBalanceDetail.packages[v.packageName] ? materialOrderPostBalanceDetail.packages[v.packageName].push(v) : (materialOrderPostBalanceDetail.packages[v.packageName] = [v]);

						propertyArr = [
						    ["名称:", v.materialModelName, "grey"],
							["型号:", v.materialModelNo, "grey"],
							["品类:", v.materialTypeName, "grey"],
							["品牌:", v.materialBrandName, "grey"],
							["单位:", v.measurementUnitName, "grey"],
							["折扣价:", v.salePrice, "blue"],
							["售价:", v.price, "blue"],
							["数量:", v.num, "green"],
                            ["结算值:", v.prePoint, "grey"],
							["说明:", v.des, "grey"],
						];
					}

					$.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});

					$divBtnWrap.appendTo($h3);
					
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

	$('#back').click(function(){
		com.switchPage('views/material/materialOrderPostBalance.html');
	});

});
