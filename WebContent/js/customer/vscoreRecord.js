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

    var lineprops = (function() {

        return [{
            field: "score",
            name: "积分操作",
            prop: "score",
            clazz: "grey"
        }, {
            field: "operateTime",
            name: "操作时间",
            prop: "operateTime",
            clazz: "green"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return constant.customer().vscoreRecord.type.keys[v.type]; },
            clazz: "red"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.customer().vscoreRecord.status.keys[v.status]; },
            clazz: "red"
        }];
    })();

    function check(){
        com.post(api.customer.queryVscoreByUnionId, {"vscore.unionId": vscore.unionId}, function(res){
            com.focusPage("#result").html(res.vscore.score == null ? 0 : res.vscore.score);
        });
    }

    if(vscore.id == 2){

        var searcher = new Searcher();
        check();

        searcher.set("condListas", "pagenationas", "resultListas", api.customer.pageVscoreRecordByUnionId, {"unionId": vscore.unionId}, ["customer-vscoreRecord-type"], "VscoreRecordPostData", null, false, null);
        searcher.line(function(v) { return "操作人:" + com.checkNull(v.operater.currentName, ''); }, lineprops, {}).render();

    }else{

        vscore.vscoreSaveBtn = com.focusPage("#vscoreSaveBtn").on('click', vscoreSaveBtn);

        var linebtns = (function() {

            var showFunc = function(v) { return v.status == constant.customer().vscoreRecord.STATUS_INIT_INT; };

            return {
                pass: {
                    name: "通过",
                    clazz: "btn-yellow",
                    show: showFunc,
                    handle: function(v) {

                        alterPass(v);
                    }
                },
                refuse: {
                    name: "拒绝",
                    clazz: "btn-success",
                    show: showFunc,
                    handle: function(v) {

                        alterdown(v);
                    }
                }
            };
        })();

        var buttons = (function() {

            var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addVscore').css("margin", "0px 3px");
            $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            $('<span></span>').text('添加积分').appendTo($adda);

            return [$adda];
        })();

        var searcher = new Searcher();
        check();

        searcher.set("condListas", "pagenationas", "resultListas", api.customer.pageVscoreRecordByUnionId, {"unionId": vscore.unionId}, ["vscoreRecordType"], "VscoreRecordPostData", null, false, buildVscoreRecordButtons);
        searcher.line(function(v) { return "操作人:" + com.checkNull(v.operater.currentName, ''); }, lineprops, linebtns).render();

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
    }

});
