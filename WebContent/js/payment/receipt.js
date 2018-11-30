jQuery(function($) {
    receipt = {
        paymentTypes: {},
        receiptTypes: {}
    };

    com.post(api.ds.payment, {}, function(res){
        var paymentTypes = res.receiptPaymentType;
        var receiptTypes = res.receiptType;

        $.each(paymentTypes, function(i, v){
            receipt.paymentTypes[v.key] = v.value;
        });

        $.each(receiptTypes, function(i, v){
            receipt.receiptTypes[v.key] = v.value;
        });

    }, null, false);

	var displayFunc  = (function(){
        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.type == 0 ? "收款" : "退款"));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var propertyArr = [
                ["款项类型:", receipt.paymentTypes[v.paymentType], "red"],
                ["收据类型:", receipt.receiptTypes[v.receiptType], "red"],
                ["名称:", v.name == "" ? "无" : v.name, "grey"],
                ["金额:", v.money, "blue"],
                ["收款时间:", v.collectTime, "green"]
            ];
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            
            $liLine.append($h3).append($ulProperty);
            
            return $liLine;
        };
      
        return {
            init : function(tableId,listData){
				com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
	
	var searcher = new Searcher();
	
	searcher.init(["r_paymentType", "r_receiptType", "r_collectTime"], "condList", api.payment.pageReceipt, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "receiptPostData", null, false, null, function(){
		var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
		var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
		var $impspan = $('<span></span>').text('导出').appendTo($impa);

		return [$impa];
	});

	com.focusPage('a[name="import"]', '#pagenation').click(function () {
    	if(com.focusPage('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}

		com.post(api.payment.pageReceipt, $.extend({}, params.receiptPostData, {"paging.noPage": 1}), function(res){
			$.exceler({
				column : [
                    ["类型","type"],
                    ["款项类型", "paymentType"],
                    ["收据类型", "receiptType"],
                    ["名称", "name"],
                    ["金额", "money"],
                    ["收款时间", "collectTime"]
				],
				list: res.paging.data
			}, function(v){
                v.type = v.type == 0 ? '收款' : '退款';
                v.paymentType = receipt.paymentTypes[v.paymentType];
                v.receiptType = receipt.receiptTypes[v.receiptType];
			});
		});
    });
});

