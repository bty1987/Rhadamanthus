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
            atttype: com.focusPage("#atttype"),
            vendor: com.focusPage("#vendor").find("input[name='vendor']")
        },

        cid: null

    };

    // 厂商切换: 法大大=文件上传(现状); e签宝=流程模板(无需本地文件, path固定esign://docTemplate, 编号填e签宝流程模板ID)
    contract.items.vendor.on('change', function() {

        var esign = contract.items.vendor.filter(":checked").val() == "2";

        com.focusPage("#esignTipRow").toggle(esign);
        com.focusPage("#pathRow").toggle(!esign);
        com.focusPage("#videoRow").toggle(!esign);
        com.focusPage("#noticePathRow").toggle(!esign);
        com.focusPage("#uploadNoticeRow").toggle(!esign);
        com.focusPage("#uploadRow").toggle(!esign);
        com.focusPage("#uploadVideoRow").toggle(!esign);
        // 编辑按钮仅编辑态(已有模板行)显示, 新增态无模板可编辑
        com.focusPage("#esignEditBtn").toggle(esign && contract.cid != null);

        if (esign) {
            contract.items.path.val("esign://docTemplate");
            contract.items.videopath.val("esign://docTemplate");
            contract.items.noticePath.val("");
        } else {
            if (contract.items.path.val() == "esign://docTemplate") contract.items.path.val("");
            if (contract.items.videopath.val() == "esign://docTemplate") contract.items.videopath.val("");
        }
    });

    contract.items.vendor.trigger('change');

    // e签宝免登落点页桥接: 落点页(contract4esignCreate/Edit.html)为同源iframe独立页,
    // 拦截器硬校验authentication参数(无session校验), 由parent桥接供给; done()用于落点页完成后的收窗+刷新
    window.contractEsignBridge = {
        authentication: function() {
            return params.authentication;
        },
        context: function() {
            return {
                name: contract.items.name.val(),
                title: contract.items.title.val(),
                page: contract.items.page.val(),
                atttype: contract.items.atttype.val()
            };
        },
        done: function() {
            // 防误重开: 落点页已完成建档/开启, 收窗时跳过frame的cancel回调重开弹窗逻辑
            contract.__esignDone = true;
            com.closePopup();
            searcher.doSearch();
        }
    };

    // frame关闭回调重开弹窗前检查守卫(落点页done()已收窗刷新时不重开)
    function reopenGuarded(callback) {

        return function() {

            if (contract.__esignDone) {
                contract.__esignDone = false;
                return;
            }

            callback();
        };
    }

    // 免登创建: 服务端换免登制作页链接(30分钟时效, 实时获取不缓存), 弹窗值经bridge.context()带入落点页预填
    com.focusPage("#esignConsoleBtn").on('click', function() {

        // 🔴时序互斥: 先收编辑弹窗再开操作台frame, 任意时刻仅一窗——规避双layer固定zIndex(编辑弹窗3000/操作台2500)
        // 互相覆盖及layer z计数被固定值压低的显示顺序问题; frame关闭(cancel/end双触发, 同id去重幂等)后原样重开弹窗
        // (#layerAdd节点跨layer关闭存活, 已填表单值与厂商形态不丢; 重开不带prepare, 不做cleanItems/initUpdate重置)
        var _title = contract.cid != null ? '编辑' : '添加';

        com.post(api.data.querySignTemplateCreateUrl, {}, function(res) {

            com.closePopup();

            com.popup4frame("e签宝模板创建页(免登, 30分钟内有效)", res.url, null, reopenGuarded(function() {

                com.popup4model('#layerAdd', _title, null, function() {

                    com.clearValidator();
                });
            }));
        });
    });

    // 免登编辑: 服务端先停用模板再换编辑页链接, 编辑完成落点页自动重新开启(TEMPLATE_CHANGED: 改模板后跨企业授权失效需重授权)
    com.focusPage("#esignEditBtn").on('click', function() {

        var _no = contract.items.no.val();

        if (!_no) {
            com.showAlert(com.warning, "编号栏为空, 无已存在的流程模板可编辑");
            return false;
        }

        com.post(api.data.querySignTemplateEditUrl, {
            "signTemplateId": _no
        }, function(res) {

            com.closePopup();

            com.popup4frame("e签宝模板编辑页(免登, 30分钟内有效)", res.url, null, reopenGuarded(function() {

                com.popup4model('#layerAdd', '编辑', null, function() {

                    com.clearValidator();
                });
            }));
        });
    });

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

    com.uploadify("#noticeUpload", "上传客户须知文件", api.common.uploadOther, 'btn btn-info', '*.*', {
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
        field: "path",
        name: "厂商",
        prop: function(v) {

            return (v.path || "").indexOf("esign://") == 0 ? "e签宝" : "法大大";
        },
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

            return constant.data().common.status.keys[v.status];
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

            return v.status == constant.data().common.STATUS_ENABLE_INT;
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

    com.focusPage('#addContract', '#pagenation').on("click", function() {

        contract.cid = null;

        com.cleanItems(contract.items);

        // 新增默认法大大形态, 重置表单行显隐; 新增可选厂商, 编辑态锁定不可切换(模板厂商建好即固定)
        contract.items.vendor.prop("disabled", false);
        contract.items.vendor.val(["1"]).trigger('change');

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

        // 编辑按path前缀回显厂商(esign://=签宝流程模板, 其余=文件上传), 触发change切换表单形态;
        // 编辑态厂商锁定不可切换(模板厂商建好即固定, 后续生成均按此厂商路由)
        contract.items.vendor.val([(v.path || "").indexOf("esign://") == 0 ? "2" : "1"]).trigger('change');
        contract.items.vendor.prop("disabled", true);
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