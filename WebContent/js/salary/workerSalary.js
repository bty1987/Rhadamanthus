jQuery(function($) {

    var salary = {

        modals: {
            workersalaryModal: com.focusPage("#workersalaryModal"),
            importModal: com.focusPage("#importModal"),
            batchSendModal: com.focusPage("#batchSendModal"),
            batchAdoptModal: com.focusPage("#batchAdoptModal"),
            annotateModal: com.focusPage("#annotateModal")
        },
        items: {
            workersalary: com.focusPage("#workersalary", "#workersalaryModal"),
            workersalaryuser: com.focusPage("#workersalaryuser", "#workersalaryModal"),
            workersalarySubtype: com.focusPage("#workersalarySubtype", "#workersalaryModal"),
            workersalarycomment: com.focusPage("#workersalarycomment", "#workersalaryModal"),

            beginTime: com.focusPage("#beginTime", "#batchSendModal"),
            finishTime: com.focusPage("#finishTime", "#batchSendModal"),
            adoptBeginTime: com.focusPage("#adoptBeginTime", "#batchAdoptModal"),
            adoptFinishTime: com.focusPage("#adoptFinishTime", "#batchAdoptModal"),
            annotate: com.focusPage("#annotate", "#annotateModal")
        },

        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            batchSendBtn: com.focusPage("#batchSendBtn"),
            batchAdoptBtn: com.focusPage("#batchAdoptBtn"),
            annotateBtn: com.focusPage("#annotateBtn")
        },

        wsid: null,
        salaryStatus: {},
        type: {},
        oneType: {},
        salaryType: {},
        twoType: {},
        twotype: {},
        pageType: params.urlLoadParams.type,

    };

    initUploadBtn();

    com.datetime(salary.items.beginTime);
    com.datetime(salary.items.finishTime);
    com.datetime(salary.items.adoptBeginTime);
    com.datetime(salary.items.adoptFinishTime);

    salary.btns.saveBtn.bindClick(saveData);
    salary.btns.batchSendBtn.bindClick(batchSend);
    salary.btns.batchAdoptBtn.bindClick(batchAdopt);
    salary.btns.annotateBtn.bindClick(saveAnnotate);

    salary.modals.workersalaryModal.on('hide.bs.modal', function(e) {

        com.cleanTypeahead("workersalaryuser");
        com.cleanItems(salary.items);
        com.closeTip();
    });

    com.initTypeahead('workersalaryuser', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": "0"
    }, "autoFillKeyValue", "key", "value", function(list, key, value) {

        return value;
    });

    com.post(api.ds.salary, {}, function(data) {

        var twotypes = [];

        $.each(data.SalaryTwoType, function(i, v) {

            if (v.status != 0)
                return true;
            twotypes.push(v);
        });

        salary.salaryStatus = data.status.split("key", "value");
        salary.type = data.type.split("id", "name");
        salary.oneType = data.oneType.split("id", "name");
        salary.twoType = data.SalaryTwoType.split("key", "oneType");
        salary.twotype = data.SalaryTwoType.split("key", "name");
        salary.items.workersalarySubtype.bindData(twotypes, "key", "name");

    }, null, false);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.salary.pageWorkerSalary);

    searcher.condition(["salary-orderId", "salary-salaryWorkduty", "salary-jober", 'salary-checker', "salary-salaryschedule", "salary-worker-count", 'salary-salarystatus', 'salary-twotype', 'salary-isCheck', "salary-createTime", 'salary-approveTime', 'salary-checkTime']);

    searcher.history("workersalaryPostData");

    searcher.button(salary.pageType == "checker" ? [] : [{
        id: "select",
        name: "全选",
        clazz: "btn-yellow",
        icon: ""
    }, {
        id: "add",
        name: "创建",
        clazz: "btn-success",
        icon: "icon-plus"
    }, {
        id: "exports",
        name: "导出",
        clazz: "btn-inverse",
        icon: "icon-download-alt"
    }, {
        id: "imports",
        name: "导入",
        clazz: "btn-danger",
        icon: "icon-upload"
    }, {
        id: "adopt",
        name: "批量通过",
        clazz: "btn-warning",
        icon: ""
    }, {
        id: "batchImport",
        name: "批量更新",
        clazz: "btn-pink",
        icon: ""
    }, {
        id: "batchSend",
        name: "批量通知",
        clazz: "btn-success",
        icon: ""
    }, {
        id: "batchAdopt",
        name: "按时间通过",
        clazz: "btn-info",
        icon: ""
    }, ]);

    var lineprops = [{
        field: "wsid",
        name: "多选",
        type: "checkbox",
        prop: "wsid"
    }, {
        field: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "grey"
    }, {
        field: "village",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "supervisor",
        name: "监理",
        prop: "decoration.supervisor.userName",
        clazz: "grey"
    }, {
        field: "workerId",
        name: "工人工号",
        prop: "user.userId",
        clazz: "grey"
    }, {
        field: "workerName",
        name: "工人姓名",
        prop: "user.currentName",
        clazz: "grey"
    }, {
        field: "dutyName",
        name: "工种",
        prop: "user.duty.name",
        clazz: "grey"
    }, {
        field: "schedule",
        name: "施工节点",
        prop: "cnid",
        dataset: constant.decoration().decoration.projectStatus.keys,
        clazz: "red"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        dataset: salary.type,
        clazz: "red"
    }, {
        field: "oneType",
        name: "一类",
        prop: "oneType",
        dataset: salary.oneType,
        clazz: "red"
    }, {
        field: "twotype",
        name: "二类",
        prop: "twotype",
        dataset: salary.twotype,
        clazz: "red"
    }, {
        field: "money",
        name: "操作金额",
        prop: function(v) {

            return v.type == 0 ? v.money : -v.money
        },
        clazz: "blue"
    }, {
        field: "salary",
        name: "工费",
        prop: function(v) {

            return v.type == 0 ? v.salary : -v.salary
        },
        clazz: "blue"
    }, {
        field: "deposit",
        name: "质保金",
        prop: function(v) {

            return v.type == 0 ? v.deposit : -v.deposit
        },
        clazz: "blue"
    }, {
        field: "count",
        name: "计数",
        prop: "count",
        clazz: "blue",
        show: function(v) {

            return (v.status in ["0", "1"])
        }
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: salary.salaryStatus,
        clazz: "red"
    }, {
        field: "isSend",
        name: "消息",
        prop: "isSend",
        dataset: {
            "0": "未发送",
            "1": "待发送",
            "2": "已发送"
        },
        clazz: "red"
    }, {
        field: "isCheck",
        name: "质检状态 ",
        prop: "isCheck",
        dataset: {
            "0": "初始",
            "1": "确认",
        },
        clazz: "red"
    }, {
        field: "isPlan",
        name: "工费类型",
        prop: "isPlan",
        dataset: {
            "0": "标准",
            "1": "计划"
        },
        clazz: "red"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.userName",
        clazz: "grey"
    }, {
        field: "approver",
        name: "审批人",
        prop: "approver.currentName",
        clazz: "grey"
    }, {
        field: "checker",
        name: "质检人 ",
        prop: "checker.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "approveTime",
        name: "审批时间",
        prop: "approveTime",
        clazz: "green"
    }, {
        field: "checkTime",
        name: "质检时间 ",
        prop: "checkTime",
        clazz: "green"
    }, {
        field: "totalArea",
        name: "总面积 ",
        prop: "decoration.house.totalArea",
        clazz: "green"
    }, {
        field: "annotate",
        name: "备注",
        prop: "annotate",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "通过",
        clazz: "btn-success",
        handle: function(v) {

            adopt(v);
            return false;
        },
        show: function(v) {

            return salary.pageType != "checker" && v.status == constant.salary().salary.STATUS_INIT_INT;
        }

    }, {
        name: "驳回",
        clazz: "btn-danger",
        handle: function(v) {

            refuse(v);
            return false;
        },
        show: function(v) {

            return salary.pageType != "checker" && v.status == constant.salary().salary.STATUS_PASS_INT;
        }
    }, {
        name: "撤销",
        clazz: "btn-warning",
        handle: function(v) {

            deletebystatus(v);
            return false;
        },
        show: function(v) {

            return salary.pageType != "checker" && v.status == constant.salary().salary.STATUS_INIT_INT;
        }
    }, {
        name: "发送通知",
        clazz: "btn-info",
        handle: function(v) {

            send(v);
            return false;
        },
        show: function(v) {

            return salary.pageType != "checker" && v.isSend == 0 && v.status == constant.salary().salary.STATUS_PASS_INT;
        }
    }, {
        name: "取消通知",
        clazz: "btn-danger",
        handle: function(v) {

            cancel(v);
            return false;
        },
        show: function(v) {

            return salary.pageType != "checker" && v.isSend == 1;
        }
    }, {
        name: "备注",
        clazz: "btn-warning",
        handle: function(v) {

            salary.wsid = v.wsid;
            salary.modals.annotateModal.modal("show");
        }
    }, {
        name: "图片",
        clazz: "btn-pink",
        handle: function(v) {

            params.salary.wsid = v.wsid;
            managedrawing(v.wsid);
        }
    }, {
        name: "质检",
        clazz: "btn-purple",
        handle: function(v) {

            check(v);
            return false;
        },
        show: function(v) {

            return salary.pageType == "checker" && v.isCheck != 1;
        }
    }, {
        name: "同步金蝶",
        clazz: "btn-warning",
        handle: function(v) {

            kingdeeUtils.workerSalary(v);

            return false;
        },
        show: function(v) {

            return salary.pageType != "checker" && v.decoration != null && v.decoration.orderId != null && v.status == 1;
        }
    }, ];

    searcher.line("user.userName", lineprops, linebtns);

    searcher.render();

    com.focusPage('a[name="add"]', '#pagenation').click(function() {

        salary.modals.workersalaryModal.modal("show");
    });

    com.focusPage('a[name="select"]').click(function() {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);

        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);

        }
    });

    com.focusPage('a[name="imports"]', '#pagenation').click(function() {

        salary.modals.importModal.modal("show");
    });

    com.focusPage('a[name="batchImport"]', '#pagenation').click(function() {

        salary.modals.workersalaryModal.modal("show");
    });

    com.focusPage('a[name="exports"]', '#pagenation').click(function() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 5000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.salary.pageWorkerSalary, $.extend({}, params.workersalaryPostData, {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [["装修单号", "decoration.orderId"], ['楼盘地址', "decoration.address"], ['总面积', "decoration.house.totalArea"], ["等级", "decoration.grade"], ['监理编号', 'decoration.supervisorId'], ['监理', 'decoration.supervisor'], ["工费Id", "wsid"], ["工人姓名", "user.userName"], ["工人工号", "user.userId"], ["工种", "user.duty.name"], ["创建人", "creater.userName"], ["创建时间", "createTime"], ["审批人", 'approver.userName'], ["审批时间", "approveTime"], ["质检时间", "checkTime"], ['操作金额', 'money'], ['工费', 'salary'], ['质保金', 'deposit'], ['施工节点', 'schedule'], ['工种', 'user.duty.name'], ['类型', 'type'], ['一类', 'onetype'], ['二类', 'twotype'], ['计数', 'count'], ['备注', 'comment'], ['状态', "status"], ['工费备注', "annotate"]],
                list: res.paging.data

            }, function(v) {

                v.approver.userName = v.approver.userName == null ? "" : v.approver.userName;
                v.comment = v.comment == null ? "" : v.comment;
                v.approveTime = v.approveTime == null ? "" : v.approveTime;
                v.decoration.supervisorId = (v.decoration.supervisor == null ? "" : v.decoration.supervisor.userId);
                v.decoration.supervisor = (v.decoration.supervisor == null ? "" : v.decoration.supervisor.userName);
                v.decoration.orderId = (v.decoration.orderId == null ? "" : v.decoration.orderId);

                v.decoration.address = (v.decoration.house == null ? "" : v.decoration.house.village.name + "" + v.decoration.house.houseNumber);

                v.status = salary.salaryStatus[v.status];
                v.schedule = v.schedule == 0 ? "" : constant.decoration().decoration.projectStatus.keys[v.cnid];
                v.type = salary.type[v.type];
                v.onetype = salary.oneType[v.onetype];

            });
        });
    });

    com.focusPage('a[name="adopt"]', '#pagenation').click(function(v) {

        var checkbox = searcher.checks();

        var options = {};
        var cwsids = [];

        if (!checkbox.length) {
            com.showAlert(com.warning, "请选择工人工费信息");
            return false;
        }

        $.each(checkbox, function(i, v) {

            var $v = $(v);

            if ($v.attr('cwsid'))
                cwsids.push($v.attr('cwsid'));

            options["workerSalarys[" + i + "].wsid"] = $v.attr('wsid');
        });

        if (cwsids.length > 0) {
            com.showAlert(com.error, "转款不允许批量通过");
            return false;
        }

        if (!options) {
            com.showAlert(com.warning, "请选择工人工费信息");
            return false;
        }

        com.post(api.salary.adoptWorkerSalary, options, function() {

            searcher.doSearch();
        });

    });

    com.focusPage('a[name="batchSend"]', '#pagenation').click(function() {

        salary.modals.batchSendModal.modal("show");
    });

    com.focusPage('a[name="batchAdopt"]', '#pagenation').click(function() {

        salary.modals.batchAdoptModal.modal("show");
    });

    function deletebystatus(v) {

        com.post(api.salary.deleteWorkerSalary, {
            "workerSalary.wsid": v.wsid
        }, function(res) {

            searcher.doSearch();
        });
    }

    function adopt(v) {

        com.post(api.salary.adoptWorkerSalary, {
            "workerSalarys[0].wsid": v.wsid
        }, function(res) {

            searcher.doSearch();
        });
    }

    function refuse(v) {

        com.post(api.salary.rejectWorkerSalary, {
            "workerSalary.wsid": v.wsid
        }, function(res) {

            searcher.doSearch();
        });
    }

    function check(v) {

        com.post(api.salary.checkWsorkerSalary, {
            "workerSalary.wsid": v.wsid
        }, function(res) {

            searcher.doSearch();
        });
    }

    function send(v) {

        com.post(api.salary.sendWorkerSalary, {
            "workerSalary.wsid": v.wsid
        }, function(res) {

            searcher.doSearch();
        });
    }

    function cancel(v) {

        com.post(api.salary.cancelWorkerSalary, {
            "workerSalary.wsid": v.wsid
        }, function(res) {

            searcher.doSearch();
        });
    }

    function saveData(options) {

        if (com.validate("workersalaryModal"))
            return false;

        var option = {
            "workerSalary.user.userId": com.typeahead("workersalaryuser"),
            "workerSalary.money": salary.items.workersalary.val(),
            "workerSalary.onetype": salary.twoType[salary.items.workersalarySubtype.val()],
            "workerSalary.twotype": salary.items.workersalarySubtype.val(),
            "workerSalary.comment": salary.items.workersalarycomment.val()
        };
        com.post(api.salary.addWorkerSalary, option, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
        salary.modals.workersalaryModal.modal("hide");
    }

    function batchSend() {

        if (com.validate("batchSendModal"))
            return false;

        var options = {
            "workerSalary.createTime": salary.items.beginTime.val() + " 00:00:00",
            "workerSalary.finishTime": salary.items.finishTime.val() + " 23:59:59",
        }

        com.post(api.salary.batchWorkerSalary, options, function(res) {

            searcher.doSearch();

            salary.modals.batchSendModal.modal("hide");
        });
    }

    function batchAdopt() {

        if (com.validate("batchAdoptModal"))
            return false;

        var options = {
            "workerSalary.createTime": salary.items.adoptBeginTime.val() + " 00:00:00",
            "workerSalary.finishTime": salary.items.adoptFinishTime.val() + " 23:59:59",
        }

        com.post(api.salary.adoptWorkerSalaryForTimeRange, options, function(res) {

            searcher.doSearch();

            salary.modals.batchAdoptModal.modal("hide");

            com.showAlert(com.info, "按时间范围批量通过操作成功");
        });
    }

    com.uploadify("#import", "上传文件", api.salary.importWorkerSalary, 'btn btn-success col-sm-12', "*.xls;*.xlsx;", {
        'uploadType': 4
    }, 1, function(data) {

        searcher.doSearch();
    });

    // 显示图片
    function managedrawing(wsid) {

        salary.drawingModal.modal("show");

        com.focusPage('#workerDrawing').html("");

        com.post(api.salary.querySalaryDrawing, {
            "salaryDrawing.sid": wsid,
            "salaryDrawing.type": 0
        }, function(data) {

            var workerSourcePics = data.salaryDrawings;

            if (workerSourcePics && workerSourcePics.length) {

                $.each(workerSourcePics, function(i, value) {

                    appendGalleryElement("workerDrawing", value, value.drawingType);
                });

                com.popup4photos("#workerDrawing");
            }
        }, null, false);
    }

    // 上传图片
    function initUploadBtn() {

        com.uploadify("#workerUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 1, function(data) {

            var options = {};

            options["salaryDrawing.sid"] = params.salary.wsid;
            options["salaryDrawing.name"] = data.strutsUploadsFileName;
            options["salaryDrawing.drawingUrl"] = data.resUrl;
            options["salaryDrawing.drawingType"] = 0;
            options["salaryDrawing.type"] = 0;
            options["salaryDrawing.filesize"] = data.filesize;

            com.post(api.salary.addSalaryDrawing, options, function(res) {

                var drawing = res.salaryDrawing;

                appendGalleryElement("workerDrawing", drawing, 0);
                com.popup4photos("#workerDrawing");
            });

            searcher.doSearch();
        });
    }

    function appendGalleryElement(galleryId, value, type) {

        var gallery = com.focusPage("#" + galleryId);

        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.sdid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);

        com.showImg(img, value.drawingUrl, 150, 150, '150x150', null, type);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.salary.deleteSalaryDrawing, {
                "salaryDrawing.sdid": value.sdid
            }, function(res) {

                com.focusPage("#gallery_li" + value.sdid).remove();
            });
        }).appendTo(toolsDiv);

        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
    }

    function saveAnnotate() {

        if (com.validate("annotateModal"))
            return false;

        var options = {
            "workerSalary.wsid": salary.wsid,
            "workerSalary.annotate": salary.items.annotate.val()
        }

        com.post(api.salary.updateWorkerSalary, options, function(res) {

            searcher.doSearch();

            salary.modals.annotateModal.modal("hide");
        });
    }
});
