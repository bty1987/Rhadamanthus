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
            videopath: com.focusPage("#videopath"),
            noticePath: com.focusPage("#noticePath"),
            atttype: com.focusPage("#atttype")
        },

        cid: null

    };

    contract.items.page.bindData(constant.data().contract.type.datas.sort(function(a, b) {

        return a.key < b.key ? -1 : 1;
    }), "key", "value");
    contract.items.atttype.bindData(constant.data().contract.atttype.datas, "key", "value");

    com.uploadify("#fileUpload", "上传模版", api.common.uploadOther, 'btn btn-success', '*.pdf', {
        'uploadType': 2
    }, 1, function(data) {

        contract.items.path.val(data.resUrl);
        contract.items.filesize.val(data.filesize);
    });

    com.uploadify("#videoUpload", "上传视频", api.common.uploadOther, 'btn btn-pink', '*.mp4', {
        'uploadType': 2
    }, 1, function(data) {

        contract.items.videopath.val(data.resUrl);
    });

    com.uploadify("#noticeUpload", "上传客户需求文件", api.common.uploadOther, 'btn btn-info', '*.*', {
        'uploadType': 2
    }, 1, function(data) {

        contract.items.noticePath.val(data.resUrl);
    });

    contract.btns.saveBtn.click(saveData);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageContract);

    searcher.condition(["data-contract-name", "data-contract-status", "data-contract-atttype"]);

    searcher.history("contractPostData");

    searcher.button([{
        id: "addContract",
        name: "添加",
        clazz: "btn-primary",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        field: "no",
        name: "编号",
        prop: "no",
        clazz: "grey"
    }, {
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
        clazz: "grey",
        show: function(v) {

            return false;
        }
    }, {
        field: "atttype",
        name: "业务类型",
        prop: "atttype",
        dataset: constant.data().contract.atttype.keys,
        clazz: "red"
    }, {
        field: "status",
        name: "状态",
        prop: function(v) {

            return v.status == 0 ? "启用" : "禁用";
        },
        clazz: "red"
    }];

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
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, flag) {

            updateStatus(v.cid, flag ? 0 : 1);

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.post(api.data.countContract, {}, function(res) {

        if (res.count > constant.data().contract.CONTRACT_COUNT_LIMIT_INT) {

            com.focusPage('#addContract', '#pagenation').hide();
        }
    });

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
        contract.items.videopath.val(v.videopath);
        contract.items.noticePath.val(v.noticePath);
        contract.items.atttype.val(v.atttype);
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
            "contract.videopath": contract.items.videopath.val(),
            "contract.noticePath": contract.items.noticePath.val(),
            "contract.url": config.server + contract.items.path.val(),
            "contract.atttype": contract.items.atttype.val()
        };

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