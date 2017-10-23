

$(function () {
    var backBtn = $('#backBtn');
    var addpuotationBtn = $('#addpuotationBtn');
    var pid =params["pid"];
    var status =params["status"];

    if (status == 5 || status == 4 || status == 3) {
        addpuotationBtn.addClass('hide');
    }
    var discount = null;
    var tot = null;
    var initList = function (listData) {
        var $tableWrap = $('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {

                var $liLine = $('<li></li>').addClass('clearfix item-blue');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').css({color: "grey", "font-weight": "bold"}).html( v.name);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                var $btnAdd = $('<a></a>').addClass('btn btn-minier').html('添加');
                var $btnItem = $('<a></a>').addClass('btn btn-minier').html('子项');
                var $btnDis = $('<a></a>').addClass('btn btn-minier').html('折让');
                var $btnDelete = $('<a></a>').addClass('btn btn-minier').html('删除');
                var $btnStatus = $('<a></a>').addClass('btn btn-minier').html('状态');
                var $btnEdit = $('<a></a>').addClass('btn btn-minier').html('编辑');

                var propertyArr = [
                    ["创建人:", v.creater.userName , "color-grey"],
                    ["创建时间:", v.createTime , "color-grey"],
                    ["折让:", v.discount, "color-grey"],
                    ["总价:", v.total, "color-grey"],
                    ["类型:", v.status == 0 ? "未使用" : "正使用", "color-red"],
                    ["说明:", v.comment, "color-grey"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
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

                $btnDiv.appendTo($h3);

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
                    e.stopPropagation();
                    layer.confirm('确定要删除吗？', {
                        btn: ['确定', '取消'] //按钮
                    }, function (indexo, layero) {
                        com.post(api.production.deletePuotation, {"puotation.qid": v.qid}, function () {
                            $('#list ul.item-list').remove();
                            queryPuotationByPid(v.pid);
                        }, function (e) {
                            com.showAlert(com.error, e.errorMsg);
                        });
                        layer.close(indexo);
                    }, function () {

                    });

                });

                $btnStatus.click(function (e) {
                    e.stopPropagation();
                    layer.confirm('确定更改状态为'+(v.status==0?"正使用":"未使用")+'吗？', {
                        btn: ['确定', '取消'] //按钮
                    }, function (indexo, layero) {
                        com.post(api.production.updatePuotationForDefault, {"puotation.qid": v.qid}, function () {
                            layer.msg('修改成功',{icon:1,time:2e3});
                            $('#list ul.item-list').remove();
                            queryPuotationByPid(v.pid);
                        }, function (e) {
                            com.showAlert(com.error, e.errorMsg);
                        });
                        layer.close(indexo);
                    }, function () {

                    });

                });
                
                $btnEdit.click(function(){
                    var name = $('#layerAdd').find('input[name="name"]').val(v.name);
                    var comment = $('#layerAdd').find('input[name="comment"]').val(v.comment);

                    $('#layerAdd').attr('data-qid', v.qid);
                    openlayer(function(){
                        var id = $('#layerAdd').attr('data-qid');
                        if(checkValue()){
                            saveData(id, function(){
                                layer.closeAll();
                            });
                        }
                    });
                });

                $btnDis.click(function(){
                    var dis = $('#layerAdd2').find('input[name="dis"]').val(v.discount);
                    discount= v.discount;
                    var total = $('#layerAdd2').find('input[name="total"]').val(v.total);
                    tot = v.total;
                    $('#layerAdd2').attr('data-qid', v.qid);
                    openlayer2(function(){
                        var id = $('#layerAdd2').attr('data-qid');
                        if(checkDisValue()){
                            saveDis(id, function(){
                                layer.closeAll();
                            });
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
        layer.closeAll();
        layer.open({
            type: 1,
            title:"报价信息",
            content: $('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9999,
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
        layer.closeAll();
        layer.open({
            type: 1,
            title:"报价折让信息",
            content: $('#layerAdd2'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9999,
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

    function saveData(id,callback){
        var $layer = $('#layerAdd');
        var name = $layer.find('input[name="name"]').val();
        var comment = $layer.find('input[name="comment"]').val();
            com.post(api.production.updatePuotation, {
                "puotation.qid": id,
                "puotation.name": name,
                "puotation.comment": comment
            }, function(res){
                callback();
                layer.msg("修改成功",{icon: 1,time:2e3});
               $('#list ul.item-list').remove();
                queryPuotationByPid(pid);
            },function(e){
                layer.msg(e.exception.errorMessage,{icon: 1,time:2e3});
            });
    }

    $('#dis').on("change",function () {

        if(checkDisValue()) {
            $('#total').val(utils.accMul(utils.accDiv(parseFloat(tot),parseFloat(discount)), parseFloat($('#dis').val())));
        }
    });

    $('#total').on("change",function () {
        if(checkDisValue()) {
            $('#dis').val(utils.accDiv( parseFloat($('#total').val()),utils.accDiv(parseFloat(tot),parseFloat(discount))).toFixed(2));
        }
    });

    function saveDis(id,callback){
        var $layer = $('#layerAdd2');
        var dis = $layer.find('input[name="dis"]').val();
        var total = $layer.find('input[name="total"]').val();
            com.post(api.production.updatePuotationForAdvance, {
                "puotation.qid": id,
                "puotation.discount": dis,
                "puotation.total": total
            }, function(res){
                callback();
               $('#list ul.item-list').remove();
                queryPuotationByPid(pid);
            });   
    }

    function checkValue(){
        var _flag = true;

        var $name = $("#layerAdd").find("input[name='name']");
        if(!$name.val()){
            _flag = false;
            $name.focus().select();
            $name.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "right",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "说明不能为空"
            }).popover('show');
        }else{
            $name.popover('destroy');
        }
        return _flag;
    }

    function checkDisValue() {
        var flag = true;
        var $dis = $("#layerAdd2").find("input[name='dis']");

        var numRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;

        if (!numRex.test($dis.val()) || parseFloat($dis.val()) > 1) {
            $dis.focus().select();
            $dis.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "折扣输入内容格式错误!"
            }).popover('show');
            flag = false;
        } else {
            $dis.popover('destroy');
        }
        return flag;
    }

});
