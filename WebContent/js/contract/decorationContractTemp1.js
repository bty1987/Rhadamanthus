jQuery(function($) {

    var contractEdit = {
        items : {
            key1 : com.focusPage("#key1"),
            key2 : com.focusPage("#key2"),
            key3 : com.focusPage("#key3"),
            key4 : com.focusPage("#key4"),
            key5 : com.focusPage("#key5"),
            key6 : com.focusPage("#key6"),
            key7 : com.focusPage("#key7"),
            key8 : com.focusPage("#key8"),
            key9 : com.focusPage("#key9"),
            key10 : com.focusPage("#key10"),
            key11 : com.focusPage("#key11"),
            key12 : com.focusPage("#key12"),
            key13 : com.focusPage("#key13"),
            key14 : com.focusPage("#key14"),
            key15 : com.focusPage("#key15"),
            key16 : com.focusPage("#key16"),
            key17 : com.focusPage("#key17"),
            key18 : com.focusPage("#key18"),
            key19 : com.focusPage("#key19"),
            key20 : com.focusPage("#key20"),
            key21 : com.focusPage("#key21"),
            key22 : com.focusPage("#key22"),
            key23 : com.focusPage("#key23"),
            key24 : com.focusPage("#key24"),
            key25 : com.focusPage("#key25"),
            key26 : com.focusPage("#key26"),
            key27 : com.focusPage("#key27"),
            key28 : com.focusPage("#key28"),
            key29 : com.focusPage("#key29"),
            key30 : com.focusPage("#key30"),
            key31 : com.focusPage("#key31"),
            key32 : com.focusPage("#key32"),
            key33 : com.focusPage("#key33"),
            key34 : com.focusPage("#key34"),
            key35 : com.focusPage("#key35"),
            key36 : com.focusPage("#key36"),
            key37 : com.focusPage("#key37"),
            key38 : com.focusPage("#key38"),
            key39 : com.focusPage("#key39"),
            key40 : com.focusPage("#key40"),
            contract: com.focusPage("#contract")
        },
		modal: {
            talkingModal : com.focusPage('#talkingModal')
        },
        Payment : {},
        decorationType: {},
        decorationOrderType: {},
        queryTalking : {},
        decorationOrderId : params.decorationOrderId,

        type: {},
        $input: null,
	};

    com.datetime(contractEdit.items.key36, 'year');

    com.post(api.ds.decoration, {}, function (res) {
        $.each(res.typeness, function (i, v) {
            contractEdit.decorationType[v.key] = v.value;
            contractEdit.decorationOrderType[v.key] = v.value;
        });
    }, null, false);

     com.post(api.data.queryCustomerById, {"customer.cid": params.cid}, function (res) {
        var customer = res.customer;
        customerItems(customer);
     });

    com.post(api.construction.queryConstructionInfoByOrderId, {"constructionInfo.orderId": contractEdit.decorationOrderId}, function (result) {
                var datas = result.constructionInfo;
                contractEdit.items.key29.val(datas.timeLimit);
                contractEdit.items.key30.val(datas.finishTime ? datas.finishTime.substr(0,4) : "");
                contractEdit.items.key31.val(datas.finishTime ? datas.finishTime.substr(5,2) : "");
                contractEdit.items.key32.val(datas.finishTime ? datas.finishTime.substr(8,2) : "");
    });

    //通过装修单号获取装修款项信息
    com.post(api.payment.queryDecorationPaymentByOrderId, {"decorationPayment.decoration.orderId": contractEdit.decorationOrderId}, function (res) {
        $.each(res.decorationPayments, function (i, v) {
            contractEdit.Payment[v.paymentType] = v.referMoney;
        });

         contractEdit.items.key22.val(contractEdit.Payment['首付款'] == null ? 0 : contractEdit.Payment['首付款']);
         contractEdit.items.key24.val(contractEdit.Payment['首付补款'] == null ? 0 : contractEdit.Payment['首付补款']);
         contractEdit.items.key25.val(contractEdit.Payment['二期款'] == null ? 0 : contractEdit.Payment['二期款']);
         contractEdit.items.key26.val(contractEdit.Payment['尾款']  == null ? 0 : contractEdit.Payment['尾款']);

    }, null, false);

    com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": contractEdit.decorationOrderId}, function (res) {
        var data = res.decoration;

        contractEdit.items.key9.val((data.house.village.cityProper.city.name == null ? " " : data.house.village.cityProper.city.name) );
        contractEdit.items.key10.val((data.house.village.cityProper == null ? " " : data.house.village.cityProper.name));
        contractEdit.items.key11.val(data.house.village.name);
        contractEdit.items.key12.val((data.house.houseNumber == null ? " " : data.house.houseNumber));
        contractEdit.items.key13.val(data.house.buildArea);
        contractEdit.items.key14.val(data.houseClass);
        contractEdit.items.key15.val(contractEdit.decorationType[data.type]);
        contractEdit.items.key16.val(contractEdit.decorationOrderType[data.type]);
        contractEdit.items.key17.val(data.orderTotalPrice);
        contractEdit.items.key18.val(utils.getCNMoney(data.orderTotalPrice));
        contractEdit.items.key19.val(contractEdit.decorationType[data.type]);
    });

    com.focusPage('#talkingResultList').click(function(){
        contractEdit.modal.talkingModal.modal("hide");
    });

    contractEdit.items.key33.dblclick(function(){
        contractEdit.$input = "#key33";
        contractEdit.type["types[0]"] = 0 ;
        contractEdit.type["types[1]"] = 1 ;
        talkingData ();
        contractEdit.modal.talkingModal.modal("show");
    });

    contractEdit.items.key39.dblclick(function(){
        contractEdit.$input = "#key39";
        contractEdit.type = {} ;
        contractEdit.type["types[0]"] = 2 ;
        talkingData ();
        contractEdit.modal.talkingModal.modal("show");
    });

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
            contractEdit.items.contract.val("");
            var list = document.getElementById("form").getElementsByTagName("*");//查询form下的所有input标签

            var data = {}; //定义一个对象数据 存放每一个input的键值对（input中“name”为key,“value”为value）

            for(var i=0; i<list.length && list[i]; i++) { //对表单中所有的input进行遍历
                // 判断不是空的 input,进行表单提交
                if (list[i].value != "" || list[i].value != null) {
                    var key = list[i].id;
                    var value = list[i].value;
                    data[key] = value;
                }
            };

            var options = {
                "decorationContract.orderId": params.decorationOrderId,
                "decorationContract.contract.cid": params.cidNumber,
                "data" : JSON.stringify(data)
            };

            com.post(api.decoration.addDecorationContract, options, function (res) {
                com.closePopup();
            });
        });
    });

    function customerItems(customer) {

        contractEdit.items.key1.val(customer.name);
        contractEdit.items.key2.val(customer.phone  == "" ? "" : customer.phone);
        contractEdit.items.key3.val(customer.identity);
        contractEdit.items.key34.val(customer.address == "" ? "/" : customer.address);
    }
});