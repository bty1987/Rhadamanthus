
jQuery(function($) {

    var constructionCost = {

        ccid: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            updateBtn: com.focusPage("#updateBtn")
        },

        modals: {
            addModal: com.focusPage("#addModal"),
            updateModal: com.focusPage("#updateModal")
        },

        items:{

            name: com.focusPage("#name"),
            areaLeft : com.focusPage("#areaLeft"),
            areaRight : com.focusPage("#areaRight"),
            accessory  : com.focusPage("#accessory"),
            salary  : com.focusPage("#salary"),

            uName : com.focusPage("#uName"),
            uAreaLeft : com.focusPage("#uAreaLeft"),
            uAeaRight : com.focusPage("#uAeaRight"),
            uAccessory  : com.focusPage("#uAccessory"),
            uSalary  : com.focusPage("#uSalary")
        },

        costStatus:{},
        editFlg: false,
    };

    constructionCost.btns.saveBtn.bindClick(saveData);
    constructionCost.btns.updateBtn.bindClick(update);

    constructionCost.modals.addModal .on("hide.bs.modal", function () {
        com.cleanItems(constructionCost.items);
        com.clearValidator();
        com.closeTip();
    });

    constructionCost.modals.updateModal.on("hide.bs.modal", function () {
        com.cleanItems(constructionCost.items);
        com.clearValidator();
        com.closeTip();
    });

    com.post(api.ds.data, {}, function(res){
        constructionCost.costStatus = res.costStatus.split("key", "value");
    },null ,false);

    var lineprops = (function() {

        return [{
            field: "areaLeft",
            name: "起始面积",
            prop: "areaLeft",
            clazz: "blue"
        }, {
            field: "areaRight",
            name: "终止面积",
            prop: "areaRight",
            clazz: "blue"
        }, {
            field: "accessory",
            name: "辅料额",
            prop: "accessory",
            clazz: "blue"
        }, {
            field: "salary",
            name: "工费额",
            prop: "salary",
            clazz: "blue"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constructionCost.costStatus[v.status]; },
            clazz: "red"
        }, {
            field: "sort",
            name: "排序",
            prop: "sort",
            clazz: "blue"
        }];
    })();

    var linebtns = (function() {

        return {
            status: {
                type: "switch",
                init: function(v) { return !v.status; },
                handle: function(v, checked) { updataStatus(v.ccid, checked ? 0 : 1); }
            },
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    constructionCost.ccid = v.ccid;
                    constructionCost.items.uName.val(v.name);
                    constructionCost.items.uAreaLeft.val(v.areaLeft);
                    constructionCost.items.uAeaRight.val(v.areaRight);
                    constructionCost.items.uAccessory.val(v.accessory);
                    constructionCost.items.uSalary.val(v.salary);
                    constructionCost.modals.updateModal.modal("show");
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addConstructionCost').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.data.pageConstructionCost, null, ["data-construction-cost-name"], "constructionCostPostData", null, false, buttons);
    searcher.line(function(v) { return ' ' + v.name; }, lineprops, linebtns).render();

    com.focusPage('#addConstructionCost').click(function(){
        constructionCost.modals.addModal.modal("show");
    });

    function update(){
        if (com.validate('updateModal')) {
            return false;
        };

        var options = {
            "constructionCost.ccid": constructionCost.ccid,
            "constructionCost.name": constructionCost.items.uName.val(),
            "constructionCost.areaLeft": constructionCost.items.uAreaLeft.val(),
            "constructionCost.areaRight": constructionCost.items.uAeaRight.val(),
            "constructionCost.accessory": constructionCost.items.uAccessory.val(),
            "constructionCost.salary": constructionCost.items.uSalary.val()
        }

        com.post(api.data.updateConstructionCost, options, function(res){
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        constructionCost.modals.updateModal.modal("hide");
    };

    function updataStatus(ccid, cvalue){

        var options = {
            "constructionCost.ccid": ccid,
            "constructionCost.status": cvalue
        }

        com.post(api.data.updateConstructionCostForStatus, options, function(res){
            cvalue == 0? com.showAlert(com.info, "已启用") : com.showAlert(com.info, "已禁用");
            searcher.doSearch();
        });
    }

    function saveData(){

        if (com.validate('addModal')) {
            return false;
        };

        var options = {
            'constructionCost.name': constructionCost.items.name.val(),
            "constructionCost.areaLeft": constructionCost.items.areaLeft.val(),
            "constructionCost.areaRight": constructionCost.items.areaRight.val(),
            "constructionCost.accessory": constructionCost.items.accessory.val(),
            "constructionCost.salary": constructionCost.items.salary.val()
        };

        com.post(api.data.addConstructionCost, options, function(res){
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        constructionCost.modals.addModal.modal("hide");
    }

})