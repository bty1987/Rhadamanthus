jQuery(function($) {

    var contract = {

        btns: {
            saveBtn: com.focusPage("#saveBtn")
        },

        items: {
            no: com.focusPage("#no"),
            name: com.focusPage("#name"),
            title: com.focusPage("#title"),
            page: com.focusPage("#page"),
            path: com.focusPage("#path"),
        },

        cid: null,

    }

    com.uploadify("#fileUpload", "上传模版", api.common.uploadOther, 'btn btn-success', '*.pdf', {
        'uploadType': 2
    }, 1, function(data) {

        contract.items.path.val(data.resUrl);
        contract.items.filesize.val(data.filesize);
    });

    contract.btns.saveBtn.click(saveData);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageContract);

    searcher.condition(["data-contract-name", "data-contract-status"]);

    searcher.history("contractPostData");

    searcher.button([{
        id: "addContract",
        name: "添加",
        clazz: "btn-primary",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        field: "title",
        name: "标题: ",
        prop: "title",
        clazz: "grey"
    }, {
        field: "page",
        name: "页面",
        prop: "page",
        clazz: "grey"
    }, {
        field: "status",
        name: "状态",
        prop: function(v) {

            return v.status == 0 ? "启用" : "禁用"
        },
        clazz: "red"
    }, ];

    var linebtns = [{
        name: "更新",
        clazz: "btn-yellow",
        handle: function(v) {

            contract.cid = v.cid;

            com.popup4model('#layerAdd', '编辑', null, function() {

                com.clearValidator();
            }, function() {

                initUpdate(v);
            });
            return false;
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        name: "启用",
        clazz: "btn-success",
        handle: function(v) {

            updateStatus(v.cid, 0);
            return false;
        },
        show: function(v) {

            return v.status == 1;
        }
    }, {
        name: "禁用",
        clazz: "btn-danger",
        handle: function(v) {

            updateStatus(v.cid, 1);
            return false;
        },
        show: function(v) {

            return v.status == 0;
        }
    }, ]

    searcher.line("no", lineprops, linebtns).render();

    com.focusPage('#addContract', '#pagenation').on("click", function() {

        contract.cid = null;

        com.cleanItems(contract.items);

        com.popup4model('#layerAdd', '添加', null, function() {

            com.clearValidator();
        });
    });

    function initUpdate(v) {

        contract.items.no.val(v.no);
        contract.items.name.val(v.name);
        contract.items.title.val(v.title);
        contract.items.page.val(v.page);
        contract.items.path.val(v.path);
    }

    function saveData() {

        if (com.validate('addContract'))
            return false;

        var url = api.data.addContract;
        var options = {
            "contract.no": contract.items.no.val(),
            "contract.name": contract.items.name.val(),
            "contract.title": contract.items.title.val(),
            "contract.page": contract.items.page.val(),
            "contract.path": contract.items.path.val(),
            "contract.url": config.server + contract.items.path.val(),
        }

        if (contract.cid) {
            options["contract.cid"] = contract.cid;

            url = api.data.updateContract;
        }

        com.post(url, options, function(res) {

            com.closePopup();
            searcher.doSearch();
        });
    }

    function updateStatus(cid, status) {

        com.post(api.data.updateContractForStatus, {
            "contract.cid": cid,
            "contract.status": status
        }, function() {

            searcher.doSearch();
        });
    }

});