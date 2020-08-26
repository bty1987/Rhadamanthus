jQuery(function($) {
    var extension = {
        decorationOrderId : params.decorationOrderId,
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancellBtn: com.focusPage("#cancelBtn"),
        modal: com.focusPage("#extensionModal"),
        extensionItems: {
            addExtensionDes : com.focusPage("#extensionDes"),
            addExtensionType : com.focusPage("#extensionType")
        }
    };

    var extraParams = {"extension.orderId" : extension.decorationOrderId};
    var typeDict = {"0":"增项", "1":"减项"};

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
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnLook = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "eids",
                "class": "ace ace-checkbox-2"
            }).val(v.eid);
            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.content);
            
            var propertyArr = [
                ["非打折总额:", v.undisPrice, "grey"],
                ["打折总额:", v.disPrice, "grey"],
                ["总价:", v.total, "grey"],
                ["类型", typeDict[v.type], 'grey'],
                ["状态:", v.status == 0 ? "初始" : v.status == 1 ? "已提交" : "-" , "red"],
                ["添加时间:", v.createTime, "grey"],
                ["说明:", v.content, "grey"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            $label.append($input).append($span).appendTo($h3);
            $divBtnWrap.append($btnLook).append($btnDel).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            //查看按钮点击事件
            $btnLook.click(function(){
                viewDetailExtension(v.eid, v.type);
            });

            $btnDel.click(function(){
                com.showConfirm("是否确认删除", function() {
                    removeRow(v.eid);
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

    var search = new Searcher();
    search.init({}, "condList", api.quotation.queryExtensionByOrderId, function(data){
        displayFunc.init('resultList', data);
    }, null, "addExtensionPostData", extraParams, true, "extensions");

    //返回按钮
    com.focusPage('#btnBack').click(function(){
        com.switchPage("/views/decoration/decoration.html");
    });

    //添加按钮
    com.focusPage('#add').click(function(){
        com.cleanItems(extension.extensionItems);

        extension.extensionItems.addExtensionType.attr('disabled', false);

        extension.modal.modal("show");
    });

    function viewDetailExtension(extensionId,type){
        params["extensionId"] = extensionId;
        params["extensionType"] = type;
        com.switchPage(api.index.extensionDetailIndex.url);
    }

    function removeRow(eid){

        com.post(api.quotation.deleteExtension,{"extension.eid": eid}, function(res){
            com.showAlert(com.info, "操作成功!");
            search.doSearch();
        });
    }

    function saveData(){

        if(com.validate("extensionModal"))
            return;

        var url;
        var options = {
            "extension.content": extension.extensionItems.addExtensionDes.val(),
            "extension.type": extension.extensionItems.addExtensionType.val(),
            "extension.orderId": extension.decorationOrderId
        };

        url = api.quotation.addExtension;
        options["extension.status"] = 0;
        options["extension.total"] = 0;

        com.post(url, options, function(res){
            com.showAlert(com.info, "操作成功");
            search.doSearch();

            extension.modal.modal("hide");
        });
    }
});
