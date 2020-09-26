jQuery(function($) {

    var cppoint = {

        btns : {
            saveBtn : com.focusPage("#saveBtn"),
        },

        modals : {
            cppointModal : com.focusPage("#cppointModal"),
            handleCppointModal: com.focusPage("#handleCppointModal"),
            cppointRecordModal: com.focusPage("#cppointRecordModal"),
        },

        items : {
            
            cppoint4decoration: com.focusPage("#cppoint4decoration"),
            cppoint4sales: com.focusPage("#cppoint4sales"),
            
            type: com.focusPage("#type"),
            pointType: com.focusPage("#pointType"),
            point: com.focusPage("#point"),
            
            cppointRecords: com.focusPage("#cppointRecords"),

        },

        cid : null,
    };
    
    cppoint.items.type.bindData([{"key" : "0", "value" : "累积"}, {"key" : "1", "value" : "消耗"}], "key", "value");
    cppoint.items.pointType.bindData([{"key" : "0", "value" : "装修"}, {"key" : "1", "value" : "销售"}], "key", "value");

    cppoint.btns.saveBtn.on("click", saveData);

    cppoint.modals.handleCppointModal.on('hide.bs.modal', function(e) {
        com.clearValidator();
        com.cleanItems(cppoint.items);
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {
                    
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                    
                    var $btnAdd = $('<a></a>').addClass('btn btn-minier btn-yellow').html('创建积分');
                    var $btnView= $('<a></a>').addClass('btn btn-minier btn-yellow').html('查询积分');
                    var $btnHandle = $('<a></a>').addClass('btn btn-minier btn-warning').html('操作积分');
                    var $btnRecord = $('<a></a>').addClass('btn btn-minier btn-inverse').html('积分记录');

                    var propertyArr = [
                        [ "姓名:", v.name, "grey" ], 
                        [ "性别:", v.gender, "grey" ], 
                        [ "身份证号:", v.identity, "grey" ], 
                        [ "军官证:", v.officer, "grey" ], 
                        [ "护照:", v.passport, "grey" ], 
                        [ "客户关系:", v.relationshipType, "grey" ], 
                        [ "邮箱:", v.email, "grey" ], 
                        [ "QQ:", v.qq, "grey" ], 
                        [ "微信:", v.wechat, "grey" ] 
                    ];

                    $.each(propertyArr, function(index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $btnAdd.click(function() {
                        addCppoint(v);
                    });

                    $btnView.click(function() {
                        showCppoint(v);
                    });

                    $btnHandle.click(function() {
                        handleCppoint(v);
                    });

                    $btnRecord.click(function() {
                        recordCppoint(v);
                    });

                    $divBtnWrap.append($btnAdd).append($btnView).append($btnHandle).append($btnRecord).appendTo($h3);
                    $liLine.append($h3).append($ulProperty).appendTo($ul);
                });
                
                $ul.appendTo($tableWrap);
            }
        };

        return {
            init : function(tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        }
    })();

    var searcher = new Searcher();

    searcher.init([ 'customer-phone', 'customer-relationship' ], "condList", api.data.pageCustomer, function(data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "cppointPostData", null, false, null, null);

    function showCppoint(v) {
        
        com.post(api.customer.queryCppoint, {"cppoint.cid" : v.cid}, function(res) {
            
            var cppoint = res.cppoint;
            
            cppoint.items.cppoint4decoration.text(cppoint.dpoint);
            cppoint.items.cppoint4sales.text(cppoint.spoint);
        });

        cppoint.modals.cppointModal.modal("show");
    }

    function addCppoint(v) {
        
        com.showConfirm("是否创建客户积分", function(){
            com.post(api.customer.createCppoint, {"cppoint.cid": v.cid});
        });
    }

    function handleCppoint(v) {
        
        cppoint.items.point.val(0);
        
        cppoint.cid = v.cid;
        
        cppoint.modals.handleCppointModal.modal("show");
    }
    
    function saveData(){
        
        if (com.validate("handleCppointModal")) {
            return false;
        }
        
        var options = {
            "cppoint.cid": cppoint.cid,
        }
        
        var type = cppoint.items.type.val();
        
        var url = type == "0" ? api.customer.addupCppoint : api.customer.useupCppoint;
        
        options[type == "0" ? "cppoint.dpoint" : "cppoint.spoint"] = cppoint.items.point.val();
        
        com.post(url, options, function(res) {
            com.showAlert(com.info, "操作成功");
            cppoint.modals.handleCppointModal.modal("hide");
        });
    }

    function recordCppoint(v) {

        cppoint.modals.cppointRecordModal.modal("show");
        cppoint.items.cppointRecords.html("");

        var $uli = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
        
        var cppointRecords = [];

        com.post(api.customer.queryCppointRecord, {"cppoint.cid" : v.cid}, function(res) {
            cppointRecords = res.cppointRecords;
        }, null, false);

        $.each(cppointRecords, function(ind, val) {
            var $liLi = $('<li></li>').addClass('item-blue clearfix');
            var $ulPro = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $h2 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html('操作人:' + val.operater.userName));

            var ecperienceArr = [
                ["类型:", val.pointType == 0 ? "装修" : "销售", "red"],
                ["操作类型:", val.type == 0 ? "累积" : "消耗", "red"],
                ["积分:", val.point, "blue"],
                ["剩余积分:", val.balance, "blue"],
                ["操作时间:", val.operateTime, "green"], 
            ];

            $.each(ecperienceArr, function(index, value) {
                var $liPro = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liPro);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liPro);
                $liPro.appendTo($ulPro);
            });

            $liLi.append($h2).append($ulPro).appendTo($uli)
        });
        
        $uli.appendTo(cppoint.items.cppointRecords);
    }

});
