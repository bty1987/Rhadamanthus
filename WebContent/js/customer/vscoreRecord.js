jQuery(function($){
    var vscore = {
        "id" : params.id,
        "unionId":params.unionId

    };
    if(vscore.id == 2){

    var displayFunc = (function(){

        var renderList = function(tableId, listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData, function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

    var creatLine = function(v){

        var $liLine = $('<li></li>').addClass('item-orange clearfix');
        var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html("操作人:"+com.checkNull(v.operater.currentName,'')));
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        var status = "";

        switch (v.status){
            case 0: status = "初始"; break;
            case 1: status = "通过"; break;
            case 2: status = "拒绝"; break;
        }

        var propertyArr = [
            ["积分操作:", v.score, "grey"],
            ["操作时间:", v.operateTime, "green"],
            ["类型:", v.type == 0 ? "新增" : "提取",'red'],
            ["状态:", status , 'red']
        ];

        $.each(propertyArr ,function(index, value){
            var $liProperty = $('<li></li>');
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        if(v.status == 0){
            $divBtnWrap.appendTo($h3);
        }else if(v.status == 1 || v.status == 2){
            $divBtnWrap;
        }

        $liLine.append($h3).append($ulProperty);

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

    var searcher = new Searcher();
    check();

    searcher.init(["vscoreRecordType"], "condList", api.customer.pageVscoreRecordByUnionId, function(data){
        displayFunc.init('resultList', data);
    },"pagenation", "VscoreRecordPostData", {"unionId" : vscore.unionId}, false, null, function(){

        var $back = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'back').css("margin", "0px 3px");
        var $$backi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($back);
        var $$backspan = $('<span></span>').text('返回').appendTo($back);

        return [$back];
    });

        com.focusPage('a[name="back"]', '#pagenation').click(function(){
        com.switchPage(api.index.vustomer.url);
    });

    function check(){
        com.post(api.customer.queryVscoreByUnionId, {"vscore.unionId" :  vscore.unionId}, function(res){

            com.focusPage("#result").html(res.vscore.score == null ? 0 : res.vscore.score);
        });
    }
    }else{

        vscore.vscoreSaveBtn = com.focusPage("#vscoreSaveBtn").on('click', vscoreSaveBtn);
        var displayFunc = (function(){

            var renderList = function(tableId, listData){
                var $tableWrap = com.focusPage('#' + tableId);
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if(listData && listData.length){
                    $.each(listData, function(i, v){
                        var $liLine = creatLine(v);

                        $liLine.appendTo($ul);
                    });
                    $ul.appendTo($tableWrap);
                }
            };

            var creatLine = function(v){

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html("操作人:"+com.checkNull(v.operater.currentName,'')));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var $btnPass = $('<a></a>').addClass('btn btn-minier btn-yellow').html('通过');
                var $btndown = $('<a></a>').addClass('btn btn-minier btn-success').html('拒绝');

                var status = "";

                switch (v.status){
                    case 0: status = "初始"; break;
                    case 1: status = "通过"; break;
                    case 2: status = "拒绝"; break;
                }
                $btnPass.click(function(){
                    alterPass(v);
                });

                $btndown.click(function(){
                    alterdown(v);
                });

                var propertyArr = [
                    ["积分操作:", v.score, "grey"],
                    ["操作时间:", v.operateTime, "green"],
                    ["类型:", v.type == 0 ? "新增" : "提取",'red'],
                    ["状态:", status , 'red']
                ];

                $.each(propertyArr ,function(index, value){
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                if(v.status == 0){
                    $divBtnWrap.append($btnPass).append($btndown).appendTo($h3);
                }else if(v.status == 1 || v.status == 2){
                    $divBtnWrap;
                }

                $liLine.append($h3).append($ulProperty);

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

        var searcher = new Searcher();
        check();

        searcher.init(["vscoreRecordType"], "condList", api.customer.pageVscoreRecordByUnionId, function(data){
            displayFunc.init('resultList', data);
        },"pagenation", "VscoreRecordPostData", {"unionId" : vscore.unionId}, false, null, function(){
            
            var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addVscore').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加积分').appendTo($adda);

            var $back = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'back').css("margin", "0px 3px");
            var $$backi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($back);
            var $$backspan = $('<span></span>').text('返回').appendTo($back);

            return [$adda,$back];
        });

        com.focusPage('a[name="back"]', '#pagenation').click(function(){
            com.switchPage(api.index.vustomerAdvance.url);
        });

        com.focusPage('a[name="addVscore"]', '#pagenation').click(function(){
            com.focusPage("#vscore").val("");
            com.focusPage("#vscoreModal").modal("show");
            com.clearValidator();
        });

        function alterPass(v){
            com.showConfirm("是否确认通过积分", function(){
                com.post(api.customer.updateVscoreRecordForStatus, {"vscoreRecord.vsrid" : v.vsrid, "vscoreRecord.status" : 1}, function(res){
                    com.showAlert(com.info, '操作成功');
                    searcher.doSearch();
                    check();
                });
            });
        }

        function alterdown(v){
            com.showConfirm("是否确认拒绝积分", function(){
                com.post(api.customer.updateVscoreRecordForStatus, {"vscoreRecord.vsrid" : v.vsrid, "vscoreRecord.status" : 2}, function(res){
                    com.showAlert(com.info, '操作成功');
                    searcher.doSearch();
                    check();
                });
            });
        }

        function vscoreSaveBtn(){
            if(com.validate()){
                return false;
            }
            var options = {
                "vscore.unionId": vscore.unionId,
                "vscore.score": com.focusPage("#vscore").val()
            };
            com.post(api.customer.raiseVscore, options, function(){
                com.showAlert(com.info, "增加积分成功");
                com.focusPage("#vscoreModal").modal("hide");
                com.focusPage("#vscore").val("");
                searcher.doSearch();
            });
        }

        function check(){
            com.post(api.customer.queryVscoreByUnionId, {"vscore.unionId": vscore.unionId}, function(res){
                com.focusPage("#result").html(res.vscore.score == null ? 0 : res.vscore.score);
            });
        }
    }

});