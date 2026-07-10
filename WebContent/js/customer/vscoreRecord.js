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

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("vscoreRecord");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var lineprops = (function() {

        var propertyMap = {
            "score": {
                field: "score",
                name: "积分操作",
                prop: "score",
                clazz: "grey"
            },
            "operateTime": {
                field: "operateTime",
                name: "操作时间",
                prop: "operateTime",
                clazz: "green"
            },
            "type": {
                field: "type",
                name: "类型",
                prop: function(v) { return constant.customer().vscoreRecord.type.keys[v.type]; },
                clazz: "red"
            },
            "status": {
                field: "status",
                name: "状态",
                prop: function(v) { return constant.customer().vscoreRecord.status.keys[v.status]; },
                clazz: "red"
            }
        };

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    function check(){
        com.post(api.customer.queryVscoreByUnionId, {"vscore.unionId": vscore.unionId}, function(res){
            com.focusPage("#result").html(res.vscore.score == null ? 0 : res.vscore.score);
        });
    }

    if(vscore.id == 2){

        var searcher = new Searcher();
        check();

        searcher.set("condListas", "pagenationas", "resultListas", pageConfig.apiPage || api.customer.pageVscoreRecordByUnionId, {"unionId": vscore.unionId}, pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-vscoreRecord-type"], "VscoreRecordPostData", null, false, null);
        searcher.line(function(v) { return "操作人:" + com.checkNull(v.operater.currentName, ''); }, lineprops, {}).render();

    }else{

        vscore.vscoreSaveBtn = com.focusPage("#vscoreSaveBtn").on('click', vscoreSaveBtn);

        var linebtns = (function() {

            var showFunc = function(v) { return v.status == constant.customer().vscoreRecord.STATUS_INIT_INT; };

            return {
                pass: {
                    name: "通过",
                    clazz: "btn-yellow",
                    show: function(v) { return btnVisible("pass") && showFunc(v); },
                    handle: function(v) {

                        alterPass(v);
                    }
                },
                refuse: {
                    name: "拒绝",
                    clazz: "btn-success",
                    show: function(v) { return btnVisible("refuse") && showFunc(v); },
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

        searcher.set("condListas", "pagenationas", "resultListas", pageConfig.apiPage || api.customer.pageVscoreRecordByUnionId, {"unionId": vscore.unionId}, pageConfig.condArr.length > 0 ? pageConfig.condArr : ["vscoreRecordType"], "VscoreRecordPostData", null, false, buttons);
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
