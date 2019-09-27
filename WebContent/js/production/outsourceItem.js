$(function(){

    var outsourceItem = {
        saveBtn : com.focusPage("#saveBtn"),
        cancelBtn : com.focusPage("#cancelBtn"),

        modals: {
            outsourceItemModal: com.focusPage("#outsourceItemModal")
        },

        items: {
            itemName : com.focusPage("#itemName"),
            height : com.focusPage("#height"),
            width : com.focusPage("#width"),
            thick : com.focusPage("#thick"),
            modeling : com.focusPage("#modeling").val(),
            measurementUnit : com.focusPage("#measurementUnit"),
            unitPrice : com.focusPage("#unitPrice"),
            itemNum : com.focusPage("#itemNum"),
            total : com.focusPage("#total"),
            comment : com.focusPage("#comment")
        },
        editFlg : true,
        oid : params.oid,
        outsourceStatus : params.outsourceStatus,
        productionStatus : params.productionStatus

    };

    outsourceItem.saveBtn.bindClick(addItem);

    outsourceItem.modals.outsourceItemModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanTypeahead("modeling");
        com.cleanItems(outsourceItem.items);
    });

    var displayFunc  = (function() {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var  creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('clearfix item-orange');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(' ' + v.name);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [
                ["高:", v.height, "blue"],
                ["宽:", v.width, "blue"],
                ["厚:", v.thick, "blue"],
                ["造型:", v.modeling, "grey"],
                ["数量:", v.num, "blue"],
                ["单价:", v.unitprice, "blue"],
                ["总价:", v.total, "red"],
                ["说明:", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($btnDelete);
            $h3.append($title).append($btnDiv);

            hidBtn($btnDelete,outsourceItem.outsourceStatus);

            $btnDelete.click(function (e) {
                com.showConfirm("是否确认删除", function(){
                    com.post(api.production.deleteOutsourceItem, {"outsourceItem.oiid": v.oiid}, function () {
                        outsourceSeacher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

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
        };
    })();

    var _condArr = [];
    var outsourceSeacher = new Searcher();

    outsourceSeacher.init( _condArr, "condList", api.production.pageOutsourceItemByOid, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "outsourcePostData", {"outsourceItem.oid": outsourceItem.oid}, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addOutsourceItem').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        var $backBtn = $('<a></a>').addClass('btn btn-minier pull-left').attr('id', 'backs').css("margin", "0px 3px");
        var $backBtns = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($backBtn);
        var $backSpan = $('<span></span>').text('返回').appendTo($backBtn);
        hidBtn($adda,outsourceItem.outsourceStatus);

        return [$adda,$backBtn];
    });

    com.initTypeahead('itemName', api.production.queryQuoteItemByPinyin,"quoteItem.pinyin",null, "quoteItems", "qiid", "name",function(list,k, v) {
        $.each(list, function (index, val) {

            if (val.qiid == k) {
                outsourceItem.items.measurementUnit.val(val.measurementunit);
                outsourceItem.items.unitPrice.val(val.unitprice);
                outsourceItem.items.itemNum.val(1);
                outsourceItem.items.total.val(utils.accMul(parseFloat($('#unitPrice').val()), parseFloat($('#itemNum').val())));
            }
        });
        return v;
    });

    com.focusPage('#backs').click(function() {
        com.switchPage(api.index.outsourceIndex.url)
    });

    com.focusPage("#addOutsourceItem").click(function() {
        outsourceItem.editFlg = true;

        outsourceItem.modals.outsourceItemModal.modal("show");
    });

    com.focusPage('#unitPrice,#itemNum,#height,#thick').on("change",function(){
        calcTotal();
    });

    function calcTotal(){
        com.clearValidator();
        var $width = outsourceItem.items.width.val();
        var $height =outsourceItem.items.height.val();
        //区分单位类型切换不同的计算方式
        var $measurementunit = outsourceItem.modals.outsourceItemModal.find('#measurementUnit').val();
        var $area = 1;

        if(com.validate("outsourceItemModal","right")){return false}

        if($measurementunit == "平" || $measurementunit =="平方米"){
            $area = utils.accMul(parseFloat($width),parseFloat($height));
            outsourceItem.modals.outsourceItemModal.find('#modeling').val($area+$measurementunit);
        }else if($measurementunit == "延米" || $measurementunit == "米"){
            $area = parseFloat($height);
        }

        outsourceItem.items.total.val(utils.accMul(utils.accMul(parseFloat($('#unitPrice').val()), parseFloat($('#itemNum').val())),$area).toFixed(2));
    }

    function addItem(){

        if (com.validate('outsourceItemModal')) {
            return false;
        }

        var options = {
            "outsource.oid" : outsourceItem.oid,
            "outsourceItems[0].name" : outsourceItem.items.itemName.val(),
            "outsourceItems[0].height" : outsourceItem.items.height.val(),
            "outsourceItems[0].width" : outsourceItem.items.width.val(),
            "outsourceItems[0].thick" : outsourceItem.items.thick.val(),
            "outsourceItems[0].modelling" : outsourceItem.items.modeling ? outsourceItem.items.modeling : ' ',
            "outsourceItems[0].num" : outsourceItem.items.itemNum.val(),
            "outsourceItems[0].unitprice" : outsourceItem.items.unitPrice.val(),
            "outsourceItems[0].total" : parseFloat(outsourceItem.items.total.val()),
            "outsourceItems[0].comment" : outsourceItem.items.comment.val()
        };

        com.post(api.production.addOutsourceItem,options,function(res){
            com.clearValidator();
            outsourceSeacher.doSearch();
            com.showAlert(com.info,"添加成功");
        },function(e){
            com.showAlert(com.info,"添加失败");
        })

        outsourceItem.modals.outsourceItemModal.modal("hide");
    }

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if (outsourceItem.productionStatus == 5 || outsourceItem.productionStatus == 4 ) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }
    }
});