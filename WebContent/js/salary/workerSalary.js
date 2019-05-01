jQuery(function ($) {

    var salary = {

        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        validator: {

            workersalary: {
                type: "v_salary",
                regex: /^-?(([1-9]\d{0,6})|(([1-9]\d{0,6}\.\d{1,3})|(0\.[1-9]{1,3})))$/,
                errorMsg: "请正确输入工人工费，小数点后最多保留3位"
            },


        },
        repeatFlg: false

    };

    var salaryType = [];

    salary.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    salary.cancelBtn = com.focusPage("#cancelBtn");
    salary.modal = com.focusPage("#workersalaryModal");
    salary.items.workersalary = com.focusPage("#workersalary");
    salary.items.workersalaryuser = com.focusPage("#workersalaryuser");
    salary.items.workersalarySubtype = com.focusPage("#workersalarySubtype");
    salary.items.workersalarycomment = com.focusPage("#workersalarycomment");

    $.extend(com.validator, salary.validator);

    com.post(api.ds.salary, {}, function (data) {
        var SalaryType = data.SalaryType;

        $.each(SalaryType, function (i, y) {
            salaryType[y.key] = y.name;

        });
    }, null, false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.user.userName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $adopt = $('<a></a>').addClass('btn btn-minier btn-success').html('通过');
            var $btnrefuse = $('<a></a>').addClass('btn btn-minier btn-danger').html('驳回');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-yellow').html('撤销');

            var propertyArr = [
                ["创建人:", v.creater.userName, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["工人工号:", v.user.userId, "grey"],
                ["工程节点:", v.schedule == 0 ? "---" : v.schedule == 3 ? "铲大白" : v.schedule == 4 ? "放线" : v.schedule == 5 ? "水工" : v.schedule == 6 ? "力工" : v.schedule == 7 ? "电工" : v.schedule == 8 ? "瓦工" : v.schedule == 9 ? "地面找平" : v.schedule == 10 ? "木工" : v.schedule == 11 ? "油工" : v.schedule == 12 ? "水电验收" : "保洁", "grey"],
                ["审批人:", v.approver.userName == null ? "无" : v.approver.userName, "grey"],
                ["审批时间:", v.approveTime == null ? "无" : v.approveTime, "green"],
                ["订单号:", v.decoration == null ? "无" : v.decoration.orderId, "blue"],
                ["楼盘地址:", (v.decoration.house) == null ? "无" : (v.decoration.house.village.name + " " + v.decoration.house.houseNumber), "grey"],
                ["监理:", v.decoration.supervisor == null ? "无" : v.decoration.supervisor.userName, "grey"],
                ["类型：", v.type == 0 ? "加" : "减", "red"],
                ["操作金额:", v.type == 0 ? v.money : -v.money, "blue"],
                ["工费:", v.type == 0 ? v.salary : -v.salary, "blue"],
                ["质保金:", v.type == 0 ? v.deposit : -v.deposit, "blue"],
                ["状态:", v.status == 0 ? "初始" : (v.status == 1 ? "已通过" : v.status == 2 ? "已驳回" : "已撤销"), "red"]
            ];

            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "check",
                "id": "check",
                "class": "ace ace-checkbox-2",
                "value": v.wsId,
                "cwsid": v.cwsid
            });
            var $span = $('<span></span>').addClass('lbl blue bigger-150');

            $.each(propertyArr, function (index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);

            });

            $divBtnWrap.append($adopt).append($btnDel).append($btnrefuse).appendTo($h3);
            $label.append($input).append($span).prependTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnDel.click(function () {
                deletebystatus(v.wsId);
            });

            $adopt.click(function () {
                adopt(v.wsId);
            });

            $btnrefuse.click(function () {
                refuse(v.wsId);
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };

    })();

    var searcher = new Searcher();
    var _condArr = ['orderId', 'salaryWorkduty', 'jober', 'salaryschedule', 'salarystatus', 'cerateTime', 'approveTime'];

    searcher.init(_condArr, "condList", api.salary.pageWorkerSalary, function (data) {
        displayFunc.init('resultList', data);

    }, "pagenation", "workersalaryPostData", null, false, null, function () {


        var $selecta = $('<a></a>').addClass('btn btn-minier btn-yellow').attr('name', 'select').css("margin", "0px 3px");
        var $selecti = $('<i></i>').addClass('icon-plus bigger-110').appendTo($selecta);
        var $selectspan = $('<span></span>').text('全选').appendTo($selecta);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('创建工费').appendTo($adda);

        var $exporta = $('<a></a>').addClass('btn btn-minier btn-inverse').attr('name', 'export').css("margin", "0px 3px");
        var $exporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exporta);
        var $exportspan = $('<span></span>').text('导出').appendTo($exporta);

        var $importa = $('<a></a>').addClass('btn btn-minier btn-danger').attr('name', 'import').css("margin", "0px 3px");
        var $importi = $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
        var $importspan = $('<span></span>').text('导入').appendTo($importa);

        var $adopta = $('<a></a>').addClass('btn btn-minier btn-warning').attr('name', 'adopt').css("margin", "0px 3px");
        var $adopti = $('<i></i>').addClass('icon-add bigger-110').appendTo($adopta);
        var $adoptspan = $('<span></span>').text('批量通过').appendTo($adopta);

        var $batchImporta = $('<a></a>').addClass('btn btn-minier btn-pink').attr('name', 'batchImport').css("margin", "0px 3px");
        var $batchImporti = $('<i></i>').addClass('icon-upload bigger-110').appendTo($batchImporta);
        var $batchImportspan = $('<span></span>').text('批量更新').appendTo($batchImporta);

        return [$selecta, $adda, $adopta, $exporta, $importa];
    });

    com.focusPage('a[name="select"]').on("click", function () {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);

        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);

        }
    });

    com.focusPage('a[name="add"]', '#pagenation').on("click", function () {

        com.cleanItems(salary.items);
        com.clearValidator();
        com.focusPage('#workersalaryModal').modal("show");
        com.updateChosen("workersalaryuser", "", "");
        com.initChosen('workersalaryuser', api.personel.queryUserByPinyin, "pinyinName", {
            "user.status": "0"
        }, "autoFillKeyValue", "key", "value");

    });

    com.focusPage('a[name="import"]', '#pagenation').on("click", function () {

        com.focusPage('#importModal').modal("show");
    });

    com.focusPage('a[name="batchImport"]', '#pagenation').on("click", function () {
        com.focusPage('#batchImportModal').modal("show");

    });

    com.focusPage('a[name="export"]', '#pagenation').on("click", function () {


        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 5000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.salary.pageWorkerSalary, $.extend({}, params.workersalaryPostData, {"paging.noPage": 1}), function (res) {

            $.exceler({
                column: [
                    ["工费Id", "wsId"],
                    ["工人姓名", "user.userName"],
                    ["工人工号", "user.userId"],
                    ["创建人", "creater.userName"],
                    ["创建时间", "createTime"],
                    ["审批人", 'approver.userName'],
                    ["审批时间", "approveTime"],
                    ["订单号", "decoration.orderId"],
                    ['楼盘地址', "decoration.house"],
                    ['监理', 'decoration.supervisor'],
                    ['操作金额', 'money'],
                    ['工费', 'salary'],
                    ['质保金', 'deposit'],
                    ['施工节点', 'schedule'],
                    ['工种', 'user.duty.name'],
                    ['类型', 'type'],
                    ['一类', 'onetype'],
                    ['二类', 'twotype'],
                    ['备注', 'comment'],
                    ['状态', "status"]
                ],
                list: res.paging.data

            }, function (v) {

                v.approver.userName = v.approver.userName == null ? "" : v.approver.userName;
                v.comment = v.comment == null ? "" : v.comment;
                v.approveTime = v.approveTime == null ? "" : v.approveTime;
                v.decoration.supervisor = (v.decoration.supervisor == null ? "" : v.decoration.supervisor.userName);
                v.decoration.orderId = (v.decoration.orderId == null ? "" : v.decoration.orderId);

                v.decoration.house = (v.decoration.house == null ? "" : v.decoration.house.village.name + "" + v.decoration.house.houseNumber);

                v.status = v.status == 0 ? "初始" : (v.status == 1 ? "已通过" : v.status == 2 ? "已驳回" : "已撤销");
                v.schedule = v.schedule == 0 ? "" : v.schedule == 3 ? "铲大白" : v.schedule == 4 ? "放线" : v.schedule == 5 ? "水工" : v.schedule == 6 ? "力工" : v.schedule == 7 ? "电工" : v.schedule == 8 ? "瓦工" : v.schedule == 9 ? "地面找平" : v.schedule == 10 ? "木工" : v.schedule == 11 ? "油工" : v.schedule == 12 ? "水电验收" : "保洁";
                v.type = v.type == 0 ? "加" : "减";
                v.onetype = v.onetype == 0 ? "工费" : v.onetype == 1 ? "扣/罚" : v.onetype == 2 ? "转款" : "其他";
                v.twotype = salaryType[v.twotype];

            });
        });

    });

    com.focusPage('a[name="adopt"]', '#pagenation').on("click", function (v) {

        var options = {};
        var groupCheckbox = com.focusPage('input[name="check"]:checked');
        var cwsIdArr = [];
        var cwsId = [];

        $.each(groupCheckbox, function (i, v) {
            var $v = $(v);
            cwsIdArr.push($v.attr('cwsid'));
            options["workerSalarys[" + i + "].wsId"] = $v.attr('value');
        });
        $.each(cwsIdArr, function (i, v) {
            if ($.inArray(v, cwsId) == -1) {
                cwsId.push(v);
            }
        });

        if (!groupCheckbox.length) {
            com.showAlert(com.warning, "请选择工人工费信息");
            return false;
        }

        if (cwsId.length != 1) {
            com.showAlert(com.error, "转款不允许批量通过");
            return false;
        }
        com.post(api.salary.adoptWorkerSalary, options, function () {
            searcher.doSearch();
        }, function () {
            com.showAlert(com.error, "工费状态不可操作");
        });

    });

    com.post(api.ds.salary, {}, function (data) {
        var SalaryType = data.SalaryTwoType;

        if (SalaryType && SalaryType.length) {
            $.each(SalaryType, function (i, v) {
                $('<option></option>').attr("value", v.key).html(v.name).appendTo(com.focusPage("#workersalarySubtype"));
            });
        }
    }, null, false);


    function saveData(options) {

        if (!com.validate("workersalaryModal")) {
            var user = com.focusPage("#workersalaryuser").val();
            var money = com.focusPage("#workersalary").val();
            var twotype = com.focusPage("#workersalarySubtype").val();
            var comment = com.focusPage("#workersalarycomment").val();
            var option = {
                "workerSalary.user.userId": user,
                "workerSalary.money": money,
                "workerSalary.twotype": twotype,
                "workerSalary.comment": comment
            };
            com.post(api.salary.addWorkerSalary, option, function (res) {
                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });
            com.focusPage('#workersalaryModal').modal("hide");
        }
    }

    function deletebystatus(wsId) {
        var options = {};
        options["workerSalary.wsId"] = wsId;
        com.post(api.salary.deleteWorkerSalary, options, function (res) {
            searcher.doSearch();
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        });
    }

    function adopt(wsId) {
        var options = {};
        options["workerSalarys[0].wsId"] = wsId;
        com.post(api.salary.adoptWorkerSalary, options, function () {
            searcher.doSearch();
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        });
    }

    function refuse(wsId) {
        bootbox.confirm("是否将已通过的薪资驳回", function (result) {
            if (result) {
                var options = {};
                options["workerSalary.wsId"] = wsId;
                com.post(api.salary.rejectWorkerSalary, options, function () {
                    searcher.doSearch();
                }, function (e) {
                    com.showAlert(com.error, e.errorMsg);
                });
            }
        })
    }

    com.focusPage('#import').Huploadify({

        'debug': false, // 开启调试
        'auto': true, // 是否自动上传
        'successTimeout': config.uploadTimeout, // 超时时间
        'formData': {
            'uploadType': 4
        },
        'buttonClass': 'btn btn-success col-sm-12',
        'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.server + 'importWorkerSalary.do', // 上传处理程序
        'height': '30', // 浏览按钮的高度
        'fileTypeDesc': '支持的格式：',  // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts': '*.xls;*.xlsx', // 允许上传的文件后缀
        'fileSizeLimit': '2MB', // 上传文件的大小限制
        'queueSizeLimit': 1, // 上传数量
        'onUploadSuccess': function (file, data, response) { //上传到服务器，服务器返回相应信息到data里

            var dateObj = eval("(" + data + ")");
            searcher.doSearch();

        }
    });

    com.focusPage('#batchImport').Huploadify({

        'debug': false, // 开启调试
        'auto': true, // 是否自动上传
        'successTimeout': config.uploadTimeout, // 超时时间
        'formData': {
            'uploadType': 4
        },
        'buttonClass': 'btn btn-success col-sm-12',
        'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.server + 'batchImportWorkerSalary.do', // 上传处理程序
        'height': '30', // 浏览按钮的高度
        'fileTypeDesc': '支持的格式：',  // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts': '*.xls;*.xlsx', // 允许上传的文件后缀
        'fileSizeLimit': '2MB', // 上传文件的大小限制
        'queueSizeLimit': 1, // 上传数量
        'onUploadSuccess': function (file, data, response) { //上传到服务器，服务器返回相应信息到data里

            var dateObj = eval("(" + data + ")");

        }
    });

});
