$(function () {

    var PaymentScale = {

        saveBtn: null,
        cancelBtn: null,
        items: {},
        validator: {

            scale: {
                type: "v_scale",
                regex: /0(\.[0-9]{0,2})/,
                errorMsg: "请输入0-1,保留小数点后两位"
            },
            repeatFlg :false
        },
        list:[]
    };

    
    var tag_input = $("#scal");

	tag_input.tag({
		placeholder:tag_input.attr('placeholder'),
		isStaticResource : true,
        allowDuplicates: true
	});

    var PaymentScalelistN = [];
    //$.extend(com.validator, PaymentScale.validator);
    PaymentScale.saveBtn = $("#saveBtn").on("click", saveData);
    PaymentScale.items.cid = $("#cid");
    PaymentScale.items.names = $("#names");
    PaymentScale.items.scale = $("#scal");
    PaymentScale.items.comment = $("#comment");


    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(tableId,v);
                });
            }
        };

        var  creatLine = function (tableId,v) {

                    var $div = $('<div></div>').appendTo($('#' + tableId));
                    var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($div);
                    var $liLine = $('<li></li>').addClass('item-blue clearfix').appendTo($ul);
                    var $h3 = $('<h3 ></h3>').addClass('oid').append($('<small style="font-size:22px;"></small>').addClass('blue')).appendTo($liLine);var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').css({'margin-top': '10px'}).appendTo($h3);
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').appendTo($ulProperty);
                    var $btnDel = $('<a></a>').addClass('btn btn-minier btn-inverse ').html('删除').appendTo($divBtnWrap);




                var propertyArr = [
                    ["款项名称:", v.name, "grey"],
                    ["比例:", v.scale, "grey"],
                    ["说明:", v.comment, "grey"]

                ];

                $.each(propertyArr, function (index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong style="font-size:15px ; padding-bottom: 50px;"  ></strong>').html(value[0]).appendTo($liProperty);
                    $('<b style="font-size:15px"></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);

                });

            $btnDel.click(function () {
                DelePaymentScale(v.psid);
            });

        };

        return {
            init: function (tableId, listData) {
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    com.post(api.system.queryCompany,{},function (data) {
        var coms = data.companys;
        $.each(coms,function (i,v) {
            $('<option></option>').attr("value", v.cid).html(v.name).appendTo("#cid");

            var $div = $('<div></div>').attr("id",v.cid).appendTo($('#resultList'));
            var $h3 = $('<h3 style="font-size:22px;"></h3>').addClass('blue').html(v.name).appendTo($div);

        });
         drawlin(coms)
    },null,false);

     function drawlin(PaymentScalelist) {

            $.each(PaymentScalelist,function (i,v) {
                com.post(api.data.queryPaymentScaleByCid, {"paymentScale.cid": v.cid}, function (data) {

                    displayFunc.init(v.cid, data.paymentScales);

                },null,false);

            });

      }

     function DelePaymentScale(psid) {
        com.post(api.data.deletePaymentScale, {"paymentScale.psid": psid}, function () {
            com.switchPage(api.index.PaymentScale.url);

        });
    }
    $("#addBtn").click(function () {

         com.cleanItems(PaymentScale.items);
        $("#clear").find("span").remove();

        $("#paymentScaleModal").modal("show");

    });

    function saveData() {
        if (!com.validate("form1")) {
            var lists = PaymentScale.items.scale.val().split(",");
            var f = 0;
            $.each(lists, function (i, v) {
                f = utils.accAdd(f, v)
            });
            if (f == 100) {
                com.post(api.data.addPaymentScale, {
                    "paymentScale.cid": PaymentScale.items.cid.val(),
                    "paymentScale.name": PaymentScale.items.names.val(),
                    "paymentScale.scale": PaymentScale.items.scale.val().replace(/\,\s*/g, "|"),
                    "paymentScale.comment": PaymentScale.items.comment.val()
                }, function () {
                    com.switchPage(api.index.PaymentScale.url);
                });
                $("#paymentScaleModal").modal("hide");
            }
            else {
                bootbox.alert("款项比例总和100.");
            }

        }
    }

});
