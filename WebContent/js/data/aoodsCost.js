$(function() {

    var aoodsCost = {
        aid: params.data.aoods.aid,

        btns: {
            backBtn: com.focusPage('#backBtn'),
            addBtn: com.focusPage('#addBtn'),
            confirmBtn: com.focusPage('#confirmBtn')
        }
    };

    aoodsCost.btns.backBtn.click(function() {
        com.closePopup();
    });

    com.post(api.data.queryConstructionCost, {}, function(res) {
        com.focusPage('select[name="constructionCost"]').bindData(res.constructionCostVOs, 'ccid', 'name', true);
    });

    var lineprops = (function() {

        return [{
            field: "areaLeft",
            name: "起始面积",
            prop: "constructionCost.areaLeft",
            clazz: "blue"
        }, {
            field: "areaRight",
            name: "终止面积",
            prop: "constructionCost.areaRight",
            clazz: "blue"
        }, {
            field: "accessory",
            name: "辅料额",
            prop: "constructionCost.accessory",
            clazz: "blue"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return v.constructionCost.status == 0 ? "启用" : "禁用"; },
            clazz: "red"
        }, {
            field: "sort",
            name: "排序",
            prop: "constructionCost.sort",
            clazz: "blue"
        }, {
            field: "numLimit",
            name: "数量上限",
            prop: "numLimit",
            clazz: "blue"
        }];
    })();

    var linebtns = (function() {

        return {
            delete: {
                name: "删除",
                clazz: "btn-yellow",
                handle: function(v) {
                    com.post(api.data.deleteAoodsCost, {
                        "aoodsCost.acid": v.acid
                    }, function() {
                        com.showAlert(com.info, "操作成功");
                        costsearcher.doSearch();
                    });
                }
            }
        };
    })();

    var costsearcher = new Searcher();

    costsearcher.set("condListCost", "pagenationCost", "resultListCost", api.data.pageAoodsCost, {
        "aoodsCost.aoods.aid": aoodsCost.aid
    }, null, "aoodsCostPostData", null, false);
    costsearcher.line("aoods.goods.name", lineprops, linebtns).render();

    aoodsCost.btns.addBtn.click(function() {
        com.popup4mini('#miniPopUp', '#addAoodsCost', "添加");
    });

    aoodsCost.btns.confirmBtn.click(function() {
        savaData();
    });

    function savaData() {

        if (com.validate('formAoodsCost', 'right')) { return false }

        var aid = aoodsCost.aid;
        var ccid = com.focusPage("#constructionCost").val();
        var numLimit = com.focusPage("#numLimit").val();

        var options = {
            "aoodsCost.aoods.aid": aid,
            "aoodsCost.constructionCost.ccid": ccid,
            "aoodsCost.numLimit": numLimit,
        };

        com.post(api.data.addAoodsCost, options, function() {
            com.showAlert(com.info, "操作成功");
            com.closePopup(com.focusPage("#confirmBtn", "#miniPopUp"));
            costsearcher.doSearch();
        });
    }

})();