
jQuery(function($) {

    var contractEdit = {
        items : {
            key1 : com.focusPage("#key1"),
            key2 : com.focusPage("#key2"),
            key3 : com.focusPage("#key3")
        },
		modal: {
            talkingModal : com.focusPage('#talkingModal')
        },
        Payment : {},
        decorationType: {},
        queryTalking : {},
        decorationOrderId : params.decorationOrderId,

        type: {},
        $input: null,
	};

    // com.datetime(contractEdit.items.startTime);

    // com.post(api.ds.decoration, {}, function (res) {
    //     $.each(res.decorationOrderType, function (i, v) {
    //         contractEdit.decorationType[v.key] = v.value;
    //     });
    // }, null, false);

    // com.post(api.construction.queryConstructionInfoByOrderId, {"constructionInfo.orderId": contractEdit.decorationOrderId}, function (result) {
    //             var datas = result.constructionInfo;
    //             contractEdit.items.workingDuration.val(datas.timeLimit);
    //             contractEdit.items.startTime.val(datas.finishTime ? datas.finishTime.substr(0,10) : "");
    // });

    //通过装修单号获取装修款项信息
    // com.post(api.payment.queryDecorationPaymentByOrderId, {"decorationPayment.decoration.orderId": contractEdit.decorationOrderId}, function (res) {
    //     $.each(res.decorationPayments, function (i, v) {
    //         contractEdit.Payment[v.paymentType] = v.referMoney;
    //     });
    //
    //      contractEdit.items.first_payment.val(contractEdit.Payment['首付款'] == null ? 0 : contractEdit.Payment['首付款']);
    //      contractEdit.items.down_payment.val(contractEdit.Payment['首付补款'] == null ? 0 : contractEdit.Payment['首付补款']);
    //      contractEdit.items.two_installment.val(contractEdit.Payment['二期款'] == null ? 0 : contractEdit.Payment['二期款']);
    //      contractEdit.items.tail_money.val(contractEdit.Payment['尾款']  == null ? 0 : contractEdit.Payment['尾款']);
    //
    // }, null, false);

    // com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": contractEdit.decorationOrderId}, function (res) {
    //     var data = res.decoration;
    //
    //     contractEdit.items.address.val((data.house.village.cityProper.city.name == null ? " " : data.house.village.cityProper.city.name) + " " + (data.house.village.cityProper == null ? " " : data.house.village.cityProper.name) + " " + data.house.village.name + " " + (data.house.houseNumber == null ? " " : data.house.houseNumber));
    //     contractEdit.items.area.val(data.house.buildArea);
    //     contractEdit.items.contract_mode.val(contractEdit.decorationType[data.type]);
    //     contractEdit.items.rental.val(data.orderTotalPrice);
    //     contractEdit.items.actualReceipt.val(data.factPrice);
    //
    // });

    com.focusPage('#talkingResultList').click(function(){
        contractEdit.modal.talkingModal.modal("hide");
    });

    contractEdit.items.key3.dblclick(function(){
        contractEdit.$input = "#key3";
        contractEdit.type["types[0]"] = 0 ;
        contractEdit.type["types[1]"] = 1 ;
        talkingData ();
        contractEdit.modal.talkingModal.modal("show");
    });

    // contractEdit.items.provisions1.dblclick(function(){
    //     contractEdit.$input = "#provisions1";
    //     contractEdit.type = {} ;
    //     contractEdit.type["types[0]"] = 2 ;
    //     talkingData ();
    //     contractEdit.modal.talkingModal.modal("show");
    // });

    function talkingData(){
        com.post(api.communion.queryTalking,contractEdit.type, function (res) {

            displayFunc.init("talkingResultList", res.talkings);

        }, null, false);
    };

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(v).appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

             var propertyArr = [
                  [" ", v.content, 'grey']
                ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($divBtnWrap).append($ulProperty);

           return $liLine.click(function(){
                var $tmp = com.focusPage(contractEdit.$input);
                var value = $tmp.val();
                $tmp.val(value + v.content);
           });

        };

        return {
            init: function (tableId, listData) {
                if(!listData.length){
					var $resultList = com.focusPage('#' + tableId).addClass('dz-default dz-message').html('');
					var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
					var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
					var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
					return $resultList;
				}else{
					com.focusPage('#' + tableId).html(null);
					renderList(tableId,listData);
				}
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    com.focusPage("#preservation").on('click', function () {
        if(com.validate('form')) return false;
        com.showConfirm("确定要保存合同信息吗?", function () {



            var options = {
                "decorationContract.orderId": params.decorationOrderId,
                "decorationContract.contract.cid": params.cidNumber,
                "data" : JSON.stringify({
                    "key1" : contractEdit.items.key1.val(),
                    "cs18": contractEdit.items.key2.val(),
                    "key3": contractEdit.items.key3.val()
                })
            };

            com.post(api.decoration.addDecorationContract, options, function (res) {
                com.closePopup();
            });
        });
    });

});
