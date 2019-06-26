$(function () {
    var backBtn = com.focusPage('#backBtn');
    var addpuotationBtn = com.focusPage('#addpuotationBtn');
    var pid =params["pid"];
    var status =params["status"];

    if (status == 5 || status == 4 || status == 3) {
        addpuotationBtn.addClass('hide');
    }
    var discount = null;
    var tot = null;
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

                if(status != 3 &&status != 4 && status != 5){
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
                    params["qid"] = v.qid;
                    params["discount"] = v.discount;
                    params["total"] = v.total;
                    params["name"] = v.name;
                    params["comment"] = v.comment;

                    com.switchPage(api.index.addPuotationItemIndex.url);
                });

                $btnItem.click(function () {
                    params["qid"] = v.qid;
                    params["status"] = status;
                    params["use"] = v.status ;
                  com.switchPage(api.index.puotationItemIndex.url);
                });

                $btnDelete.click(function (e) {
                    com.showConfirm("是否确认删除", function(){
                        com.post(api.production.deletePuotation, {"puotation.qid": v.qid}, function () {
                            com.focusPage('#list ul.item-list').remove();
                            queryPuotationByPid(v.pid);
                        });
                    });
                });

                $btnStatus.click(function (e) {
                    com.showConfirm("确定更改状态为" + (v.status == 0 ? "正使用" : "未使用"), function(){
                        com.post(api.production.updatePuotationForDefault, {"puotation.qid": v.qid}, function () {
                            com.focusPage('#list ul.item-list').remove();
                            queryPuotationByPid(v.pid);
                        });
                    });
                });
                
                $btnEdit.click(function(){
                    var name = com.focusPage('#layerAdd').find('input[name="name"]').val(v.name);
                    var comment = com.focusPage('#layerAdd').find('input[name="comment"]').val(v.comment);

                    com.focusPage('#layerAdd').attr('data-qid', v.qid);
                    openlayer(function(){
                        var id = com.focusPage('#layerAdd').attr('data-qid');
                        saveData(id);
                    });
                });

                $btnDis.click(function(){
                    var dis = com.focusPage('#layerAdd2').find('input[name="dis"]').val(v.discount);
                    discount= v.discount;
                    var total = com.focusPage('#layerAdd2').find('input[name="total"]').val(v.total);
                    tot = v.total;
                    com.focusPage('#layerAdd2').attr('data-qid', v.qid);
                    com.clearValidator();

                    openlayer2(function(){
                        var id = com.focusPage('#layerAdd2').attr('data-qid');
                        if(!com.validate("layerAdd2",null)){
                            saveDis(id);
                        }
                    });
                });
            });
            $ul.appendTo($tableWrap);
        }
    };
    queryPuotationByPid(pid);

    function queryPuotationByPid(pid) {
        com.post(api.production.queryPuotationByPid, {"puotation.pid": pid}, function (data) {
            initList(data.puotations);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    }
    
    backBtn.click(function () {
        com.switchPage(api.index.productionIndex.url);
    });
    
    addpuotationBtn.click(function () {
            com.switchPage(api.index.createPutationIndex.url);
    });

    function openlayer(callback){
        com.closePopup();
        layer.open({
            type: 1,
            title:"报价信息",
            content: com.focusPage('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9000,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);
            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    }
    function openlayer2(callback){
        com.closePopup();
        layer.open({
            type: 1,
            title:"报价折让信息",
            content: com.focusPage('#layerAdd2'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9000,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);
            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    }

    function saveData(id){
        var $layer = com.focusPage('#layerAdd');
        var name = $layer.find('input[name="name"]').val();
        var comment = $layer.find('input[name="comment"]').val();
            com.post(api.production.updatePuotation, {
                "puotation.qid": id,
                "puotation.name": name,
                "puotation.comment": comment
            }, function(res){
                com.showAlert(com.info, "操作成功");
                com.focusPage('#list ul.item-list').remove();
                queryPuotationByPid(pid);
            });
    }

    com.focusPage('#dis').on("change",function () {
        com.clearValidator();
        if(!com.validate("layerAdd2",null)) {
            com.focusPage('#total').val(utils.accMul(utils.accDiv(parseFloat(tot),parseFloat(discount)), parseFloat($('#dis').val())));
        }
    });

    //$('#total').on("change",function () {
    //    com.clearValidator();
    //    if(!com.validate("layerAdd2",null)) {
    //        $('#dis').val(utils.accDiv( parseFloat($('#total').val()),utils.accDiv(parseFloat(tot),parseFloat(discount))).toFixed(2));
    //    }
    //});

    function saveDis(id){
        var $layer = com.focusPage('#layerAdd2');
        var dis = $layer.find('input[name="dis"]').val();
        var total = $layer.find('input[name="total"]').val();
            com.post(api.production.updatePuotationForAdvance, {
                "puotation.qid": id,
                "puotation.discount": dis,
                "puotation.total": total
            }, function(res){
                com.focusPage('#list ul.item-list').remove();
                queryPuotationByPid(pid);
            });   
    }

});
