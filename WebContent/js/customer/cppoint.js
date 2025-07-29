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
            cppoint4operate: com.focusPage("#cppoint4operate"),
            
            type: com.focusPage("#type"),
            pointType: com.focusPage("#pointType"),
            point: com.focusPage("#point"),
            
            cppointRecords: com.focusPage("#cppointRecords")
        },
        cid : null
    };

    cppoint.items.type.bindData(constant.customer().cppoint.type.datas,"key","value");
    cppoint.items.pointType.bindData(constant.customer().cppoint.cppointType.datas,"key","value");

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
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.customer.name));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                    
                    var $btnAdd = $('<a></a>').addClass('btn btn-minier btn-yellow').html('创建积分');
                    var $btnView= $('<a></a>').addClass('btn btn-minier btn-yellow').html('查询积分');
                    var $btnHandle = $('<a></a>').addClass('btn btn-minier btn-warning').html('操作积分');
                    var $btnRecord = $('<a></a>').addClass('btn btn-minier btn-inverse').html('积分记录');

                    var propertyArr = [
                        [ "姓名:", v.customer.name, "grey" ], 
                        [ "性别:", v.customer.gender, "grey" ], 
                        [ "身份证号:", v.customer.identity, "grey" ], 
                        [ "军官证:", v.customer.officer, "grey" ], 
                        [ "护照:", v.customer.passport, "grey" ], 
                        [ "客户关系:", v.customer.relationshipType, "grey" ], 
                        [ "邮箱:", v.customer.email, "grey" ], 
                        [ "QQ:", v.customer.qq, "grey" ], 
                        [ "微信:", v.wechat, "grey" ],
                        [ "装修积分:", v.dpoint, "grey" ],
                        [ "主材积分:", v.spoint, "grey" ],
                        [ "运营积分:", v.opoint, "grey" ],
                        [ "装修单号:", v.orderId, "grey" ],
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

    searcher.init(['customer-v-name'], "condList", api.customer.pageCppoint, function(data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "cppointPostData", null, false, null, null);

    function showCppoint(v) {
        
        com.post(api.customer.queryCppoint, {"cppoint.cid" : v.cid}, function(res) {
            var cppointValue = res.cppoint;     
            if(cppointValue.dpoint==null||cppointValue.spoint==null||cppointValue.opoint==null){	
            	cppoint.items.cppoint4decoration.text("该用户尚未创建积分");
            	cppoint.items.cppoint4sales.text("该用户尚未创建积分");
                cppoint.items.cppoint4operate.text("该用户尚未创建积分");
            }else{
            	cppoint.items.cppoint4decoration.text(cppointValue.dpoint);
            	cppoint.items.cppoint4sales.text(cppointValue.spoint);
                cppoint.items.cppoint4operate.text(cppointValue.opoint);
            }
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
        var pointType = cppoint.items.pointType.val();

        var url = pointType == 0 ? api.customer.addupCppoint : api.customer.useupCppoint;
        
        if (type == 0) {
            options["cppoint.dpoint"] = cppoint.items.point.val();
        }

        if (type == 1) {
            options["cppoint.spoint"] = cppoint.items.point.val();
        }

        if (type == 2) {
            options["cppoint.opoint"] = cppoint.items.point.val();
        }

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

        com.post(api.customer.queryCppointRecord, {"cppoint.cpid" : v.cpid}, function(res) {
            cppointRecords = res.cppointRecords;
        }, null, false);

        $.each(cppointRecords, function(ind, val) {
            var $liLi = $('<li></li>').addClass('item-blue clearfix');
            var $ulPro = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $h2 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html('操作人:' + val.operater.userName));

            var ecperienceArr = [
                ["类型:", constant.customer().cppoint.type.keys[val.pointType], "red"],
                ["操作类型:", constant.customer().cppoint.cppointType.keys[val.type], "red"],
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
