jQuery(function($){
    var vscore = {
        modals:{
            vscoreModal:com.focusPage("#vscoreModal")
        },
        items:{
            vscore: com.focusPage("#vscore")
        },
        id : params.customer.id,
        unionId: params.customer.unionId

    };

    vscore.modals.vscoreModal.on("hide.bs.modal", function () {
        com.cleanItems();
        com.clearValidator();
    });

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

            var propertyArr = [
                ["积分操作:", v.score, "grey"],
                ["操作时间:", v.operateTime, "green"],
                ["类型:", v.type == 0 ? "新增" : "提取",'red'],
                ["状态:", v.status!=0?(v.status==1?"通过":"拒绝"):"初始", 'red']
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

        searcher.init(["customer-vscoreRecord-type"], "condListas", api.customer.pageVscoreRecordByUnionId, function(data){
            displayFunc.init('resultListas', data);
        },"pagenationas", "VscoreRecordPostData", {"unionId" : vscore.unionId}, false, null, function(){
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
                    ["状态:", v.status!=0?(v.status==1?"通过":"拒绝"):"初始" , 'red']
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

        searcher.init(["vscoreRecordType"], "condListas", api.customer.pageVscoreRecordByUnionId, function(data){
            displayFunc.init('resultListas', data);
        },"pagenationas", "VscoreRecordPostData", {"unionId" : vscore.unionId}, false, null, function(){
            
            var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addVscore').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加积分').appendTo($adda);

            return [$adda];
        });

        com.focusPage('#addVscore').click(function(){
            vscore.modals.vscoreModal.modal("show");
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

            if(com.validate("form")){
                return false;
            }
            var options = {
                "vscore.unionId": vscore.unionId,
                "vscore.score": vscore.items.vscore.val()
            };
            com.post(api.customer.raiseVscore, options, function(){
                com.showAlert(com.info, "增加积分成功");
                searcher.doSearch();
            });
            vscore.modals.vscoreModal.modal("hide");
        }

        function check(){
            com.post(api.customer.queryVscoreByUnionId, {"vscore.unionId": vscore.unionId}, function(res){
                com.focusPage("#result").html(res.vscore.score == null ? 0 : res.vscore.score);
            });
        }
    }

});