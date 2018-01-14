
jQuery(function($) {
	
	$('#fl-statement').statement("主材订单", "型号信息");
	
	var options = {};
	var _options = {};
	var url = api.material.queryMaterialItemByMid;
	var refundUrl = api.material.queryMaterialRefundByMid;
	var _arr = [];
	var flag = 0;
	options["materialItem.mid"] = params['materialSubOrder.msoId'];
	_options["materialRefund.mid"] = params['materialSubOrder.msoId'];

    if(params['materialOrderPostBalance.type'] == 1 || params['materialOrderPostBalance.type'] == 2){
        _options['idents[0]'] = params['idents[0]'];
        com.post(refundUrl,_options,function (_data) {
            displayFunc.init('resultList',_data.materialRefunds);
        });
	}else if(params['materialOrderPostBalance.type'] == 0){
	       		com.post(url, options, function(data){
	        	createArr(data.materialItems);
	        	displayFunc.init('resultList',_arr);
        });
        	com.post(refundUrl,_options,function (_data) {
            createArr(_data.materialRefunds);
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
                        if(val.name == _arr[a].name && val.no == _arr[a].no && val.price == _arr[a].price  && val.salePrice == _arr[a].salePrice && val.prePoint == _arr[a].prePoint){
                            _arr[a].num = utils.accAdd(val.num,_arr[a].num);
                            _arr[a].total = utils.accAdd(val.total,_arr[a].total);
                            break;
                        }else if(val.name != _arr[a].name ||  val.no != _arr[a].no || val.price != _arr[a].price  || val.salePrice != _arr[a].salePrice || val.prePoint != _arr[a].prePoint){
                            flag ++;
                        }
					}else{
                		    if(val.packageName == _arr[a].packageName && val.isLeaf == false && _arr[a].isLeaf == false){
                                _arr[a].total = utils.accAdd(val.total,_arr[a].total);
                                break;
							}
                            if(val.name == _arr[a].name && val.no == _arr[a].no && val.packageName == _arr[a].packageName && val.price == _arr[a].price  && val.salePrice == _arr[a].salePrice && val.prePoint != _arr[a].prePoint){
                                _arr[a].num = utils.accAdd(val.num,_arr[a].num);
                                _arr[a].total = utils.accAdd(val.total,_arr[a].total);
                                break;
                            }else if(val.name != _arr[a].name ||  val.no != _arr[a].no || val.packageName != _arr[a].packageName || val.price != _arr[a].price  || val.salePrice != _arr[a].salePrice || val.prePoint != _arr[a].prePoint){
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
					
					//if(v.level == 0 && v.isLeaf == true){
					if(v.packageName == "" || v.packageName == null){
						$h3.append($('<small></small>').addClass('blue').html(v.name));

						propertyArr = [
							["型号:", v.no, "grey"],
							["品类:", v.category, "grey"],
							["品牌:", v.brand, "grey"],
							["单位:", v.measurementUnit, "grey"],
							["折扣价:", v.salePrice, "blue"],
							["售价:", v.price, "blue"],
							["数量:", v.num, "green"],
							["总价:", v.total, "green"],
							["结算值:", v.prePoint, "grey"],
							["说明:", v.comment, "grey"],
						];
					//}else if(v.level == 0 && v.isLeaf == false){
					}else if(v.packageName != "" && v.packageName != null && v.brand == "-"){
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
						    ["名称:", v.name, "grey"],
							["型号:", v.no, "grey"],
							["品类:", v.category, "grey"],
							["品牌:", v.brand, "grey"],
							["单位:", v.measurementUnit, "grey"],
							["折扣价:", v.salePrice, "blue"],
							["售价:", v.price, "blue"],
							["数量:", v.num, "green"],
                            ["结算值:", v.prePoint, "grey"],
							["说明:", v.comment, "grey"],
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
		com.switchPage('views/material/materialPostBalance.html');
	});

});
