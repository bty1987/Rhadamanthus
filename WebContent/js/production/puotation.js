$(function (){

    var puotation={

        btns:{
            editConfirmBtn : com.focusPage('#editConfirmBtn'),//报价信息确定按钮
            distConfirmBtn : com.focusPage('#distConfirmBtn'),//报价折让信息确定按钮
            backBtn : com.focusPage('#backBtn'),//返回按钮
            addpuotationBtn : com.focusPage('#addpuotationBtn'),//创建按钮
        },

        models:{
            discountModal:com.focusPage("#discountModal"),
            editModal:com.focusPage("#editModal")
        },

        items:{
            qid: com.focusPage("#qid"),
            creater : com.focusPage("#creater"),
            total : com.focusPage("#total"),
            discount : com.focusPage('#discount'),
            name: com.focusPage("#name"),
            comment: com.focusPage("#comment")
        },
        pid : params.pid,
        status : params["status"],
        discount : null,
        tot : null
    };


        puotation.btns.distConfirmBtn.bindClick(saveDis);

        puotation.btns.editConfirmBtn.bindClick(saveData);

        puotation.btns.backBtn.click(function () {
            com.switchPage(api.index.productionIndex.url);
        });

        puotation.btns.addpuotationBtn.click(function () {
            com.switchPage(api.index.createPutationIndex.url);
        });

        puotation.models.discountModal.on("hide.bs.modal", function () {
            com.closeTip();
        });

        puotation.models.editModal.on("hide.bs.modal", function () {
            com.closeTip();
        });

   var initList = function (listData) {
        var $tableWrap = com.focusPage('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {

                var $liLine = $('<li></li>').addClass('clearfix item-orange');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html( v.name);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var $btnAdd = $('<a></a>').addClass('btn btn-minier btn-yellow').html('添加');
                var $btnItem = $('<a></a>').addClass('btn btn-minier btn-success').html('子项');
                var $btnDis = $('<a></a>').addClass('btn btn-minier btn-warning').html('折让');
                var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-inverse').html('删除');
                var $btnStatus = $('<a></a>').addClass('btn btn-minier btn-danger').html('状态');
                var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-pink').html('编辑');

                var propertyArr = [
                    ["创建人:", v.creater.userName , "grey"],
                    ["创建时间:", v.createTime , "green"],
                    ["折让:", v.discount, "blue"],
                    ["总价:", v.total, "blue"],
                    ["类型:", v.status == 0 ? "未使用" : "正使用", "red"],
                    ["说明:", v.comment, "grey"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);

                if(puotation.status != 3 &&puotation.status != 4 && puotation.status != 5){
                    if(v.status==0){
                        $btnDiv.append($btnAdd).append($btnItem).append($btnDis).append($btnDelete).append($btnStatus).append($btnEdit);
                    }else if(v.status==1){
                        $btnDiv.append($btnItem).append($btnStatus);
                    }
                }else{
                    $btnDiv.append($btnItem);
                };

                $h3.append($title).append($btnDiv);

                $btnAdd.click(function () {
                    addPuotationItem(v);
                });

                $btnItem.click(function () {
                    showItem(v);
                });

                $btnDelete.click(function (e) {
                    delectPuotation(v);
                });

                $btnStatus.click(function (e) {
                    statusPuotation(v);
                });

                $btnEdit.click(function(){
                    showUpdate(v);
               });

                $btnDis.click(function(){
                    viewDiscountInfo(v);
                });
            });
            $ul.appendTo($tableWrap);
        }
    };

    queryPuotationByPid(puotation.pid);

    function viewDiscountInfo(v){

        com.clearValidator();

        puotation.items.qid = v.qid;
        puotation.items.discount.val(v.discount);
        puotation.items.total.val(v.total);
        puotation.discount= v.discount;
        puotation.tot = v.total;
        puotation.models.discountModal.modal("show");
    }

    function showUpdate(v) {
        com.clearValidator();

        puotation.items.qid = v.qid;
        puotation.items.name.val(v.name);
        puotation.items.comment.val(v.comment);
        puotation.models.editModal.modal("show");
    }

    function addPuotationItem(v){

           params["qid"] = v.qid;
           params["discount"] = v.discount;
           params["total"] = v.total;
           params["name"] = v.name;
           params["comment"] = v.comment;

        com.switchPage(api.index.addPuotationItemIndex.url);
    };

    function showItem(v){

           params["qid"] = v.qid;
           params["status"] = puotation.status;
           params["use"] = v.status ;
        com.switchPage(api.index.puotationItemIndex.url);
    };

    function delectPuotation(v) {
        com.showConfirm("是否确认删除", function(){
            com.post(api.production.deletePuotation, {"puotation.qid": v.qid}, function () {
                com.focusPage('#list ul.item-list').remove();
                queryPuotationByPid(v.pid);
                com.showAlert(com.info, "操作成功");
            });
        });

    };

    function statusPuotation(v) {
        com.showConfirm("确定更改状态为" + (v.status == 0 ? "正使用" : "未使用"), function(){
            com.post(api.production.updatePuotationForDefault, {"puotation.qid": v.qid}, function () {
                com.focusPage('#list ul.item-list').remove();
                queryPuotationByPid(v.pid);
                com.showAlert(com.info, "操作成功");
            });
        });
    };

    function saveData(){
        if (com.validate('editModal')) {
            return false;
        }

        var options = {
            "puotation.qid" :  puotation.items.qid,
            "puotation.name" : puotation.items.name.val(),
            "puotation.comment" : puotation.items.comment.val()
        };

        com.post(api.production.updatePuotation,options,function () {
            com.focusPage('#list ul.item-list').remove();
            com.showAlert(com.info, "操作成功");
            queryPuotationByPid(puotation.pid)
            puotation.models.editModal.modal("hide");
        })
    };

    function saveDis(){
        if (com.validate('discountModal')) {
            return false;
        };

        if(puotation.items.discount.val()> 1 || puotation.items.discount.val()<0.01) {
            com.showAlert(com.warning, "请输入0到1之间的两位小数");
            return false;
        };

        var options = {
            "puotation.qid": puotation.items.qid,
            "puotation.discount": puotation.items.discount.val(),
            "puotation.total": puotation.items.total.val()
        };

        com.post(api.production.updatePuotationForAdvance, options, function () {
            com.focusPage('#list ul.item-list').remove();
            com.showAlert(com.info, "操作成功");
            queryPuotationByPid(puotation.pid)
            puotation.models.discountModal.modal("hide");
        });
    };

    function queryPuotationByPid(pid) {
        com.post(api.production.queryPuotationByPid, {"puotation.pid": puotation.pid}, function (data) {
            initList(data.puotations);

        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };

    puotation.items.discount.on("change",function () {
         com.clearValidator();
        if(!com.validate("discountModal",null)) {
            com.focusPage('#total').val(utils.accMul(utils.accDiv(parseFloat(puotation.tot),parseFloat(puotation.discount)), parseFloat($('#discount').val())));
        }

    });


});
