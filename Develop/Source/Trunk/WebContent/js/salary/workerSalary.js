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
        repeatFlg :false

    };

    var salaryType = [];
    
    salary.saveBtn = $("#saveBtn").on("click", saveData);
    salary.cancelBtn = $("#cancelBtn");
    salary.modal = $("#workersalaryModal");
    salary.items.workersalary= $("#workersalary");
    salary.items.workersalaryuser = $("#workersalaryuser");
    salary.items.workersalarycomment = $("#workersalarycomment");

    $.extend(com.validator, salary.validator);

    com.post(api.ds.salary,{},function (data) {
        var SalaryType = data.SalaryType;

        $.each(SalaryType,function (i,y) {
            salaryType[y.key] = y.name;

        });
    },null,false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
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

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.user.userName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $adopt = $('<a></a>').addClass('btn btn-minier btn-primary').html('通过');
            var $btnrefuse = $('<a></a>').addClass('btn btn-minier btn-danger').html('驳回');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-inverse').html('删除');

            var propertyArr = [
                ["创建人:", v.creater.userName, "grey"],
                ["创建时间:", v.createTime, "grey"],
                ["审批人:", v.approver.userName == null ? "无" : v.approver.userName, "grey"],
                ["审批时间:", v.approveTime == null ? "无" : v.approveTime, "grey"],
                ["订单号:", v.decorationOrder.orderId == null ? "无" : v.decorationOrder.orderId, "grey"],
                ["楼盘地址:", ( v.decorationOrder.houseNumber) == null ? "无" : (v.decorationOrder.village.villageName + "" + v.decorationOrder.houseNumber), "grey"],
                ["监理:", v.decorationOrder.supervisor == null ? "无" : v.decorationOrder.supervisor, "grey"],
                ["类型：", v.type == 0 ? "工费" : "扣款", "red"],
                ["金额:", v.salary, "grey"],
                ["状态:", v.status == 0 ? "初始" : (v.status == 1 ? "已通过" : "已驳回"), "grey"]
            ];

            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "check",
                "id": "check",
                "class": "ace ace-checkbox-2",
                "value": v.wsId
            });
            var $span = $('<span></span>').addClass('lbl blue bigger-150');

            $.each(propertyArr, function (index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);

            });

            $divBtnWrap.append($adopt).append($btnrefuse).append($btnDel).appendTo($h3);
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
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();
    var _condArr = ['orderId','salaryWorkduty', 'jober','salarystatus','cerateTime', 'approveTime'];

    searcher.init(_condArr, "condList", api.salary.pageWorkerSalary, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "workersalaryPostData", null, false, null, function () {


        var $selecta = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'select').css("margin", "0px 3px");
        var $selecti = $('<i></i>').addClass('icon-plus bigger-110').appendTo($selecta);
        var $selectspan = $('<span></span>').text('全选').appendTo($selecta);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('创建').appendTo($adda);

        var $exporta = $('<a></a>').addClass('btn btn-minier ').attr('name', 'export').css("margin", "0px 3px");
        var $exporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exporta);
        var $exportspan = $('<span></span>').text('导出').appendTo($exporta);

        var $importa = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $importi = $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
        var $importspan = $('<span></span>').text('导入').appendTo($importa);

        var $adopta = $('<a></a>').addClass('btn btn-minier btn-primary').attr('name', 'adopt').css("margin", "0px 3px");
        var $adopti = $('<i></i>').addClass('icon-add bigger-110').appendTo($adopta);
        var $adoptspan = $('<span></span>').text('通过').appendTo($adopta);

        var $batchImporta = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'batchImport').css("margin", "0px 3px");
        var $batchImporti = $('<i></i>').addClass('icon-upload bigger-110').appendTo($batchImporta);
        var $batchImportspan = $('<span></span>').text('批量更新').appendTo($batchImporta);

        return [$selecta, $adda, $adopta, $exporta, $importa,$batchImporta];
    });

    $('a[name="select"]').on("click", function () {

        if ($('input[type="checkbox"]').prop('checked')) {
            $('input[type="checkbox"]').removeAttr('checked');
            $('input[type="checkbox"]').prop('checked', false);

        } else {
            $('input[type="checkbox"]').attr('checked', true);
            $('input[type="checkbox"]').prop('checked', true);

        }
    });

    $('a[name="add"]', '#pagenation').on("click", function () {

        com.cleanItems(salary.items);
        $('#workersalaryModal').modal("show");
        com.initChosen('workersalaryuser', api.personel.queryUserForNameByPinyinName, "pinyinName", {"userNamePinYin": $("#workersalaryuser").val()}, "autoFillKeyValue", "key", "value");

    });

    $('a[name="import"]', '#pagenation').on("click", function () {

        $('#importModal').modal("show");
    });

    $('a[name="batchImport"]', '#pagenation').on("click", function () {
        $('#batchImportModal').modal("show");

    });

    $('a[name="export"]', '#pagenation').on("click", function () {

        if ($('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if ($('span[name="totalRecords"]').text() > 5000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.salary.pageWorkerSalary, $.extend({}, params.workersalaryPostData, {"paging.noPage": 1}), function (res) {

            $.exceler({
                column: [
                    ["工费Id","wsId"],
                    ["工人姓名", "user.userName"],
                    ["工人工号", "user.userId"],
                    ["创建人", "creater.userName"],
                    ["创建时间", "createTime"],
                    ["审批人", 'approver.userName'],
                    ["审批时间", "approveTime"],
                    ["订单号", "decorationOrder.orderId"],
                    ['楼盘地址', ['decorationOrder.village', 'decorationOrder.houseNumber']],
                    ['监理', 'decorationOrder.supervisor'],
                    ['金额', 'salary'],
                    ['工种', 'user.duty'],
                    ['类型', 'subtype'],
                    ['备注', 'comment'],
                    ['状态',"status"]
                ],
                list: res.paging.data

            }, function (v) {

                v.approver.userName = v.approver.userName == null ? "" : v.approver.userName;
                v.comment = v.comment == null ? "" : v.comment;
                v.approveTime = v.approveTime == null ? "" : v.approveTime;
                v.decorationOrder.supervisor = v.decorationOrder.supervisor == null ? "" : v.decorationOrder.supervisor;
                v.decorationOrder.orderId = v.decorationOrder.orderId == null ? "" : v.decorationOrder.orderId;
                v.decorationOrder.village = v.decorationOrder.village == null ? "" : v.decorationOrder.village.villageName;
                v.decorationOrder.houseNumber = v.decorationOrder.houseNumber == null ? "" : v.decorationOrder.houseNumber;
                v.status =  v.status == 0 ? "初始" : (v.status == 1 ? "已通过" : "已驳回") ;
                v.subtype = salaryType[v.subtype];

            });
        });

    });

    $('a[name="adopt"]', '#pagenation').on("click", function (v) {

        var options = {};
        var groupCheckbox = $('input[name="check"]:checked');

        $.each(groupCheckbox, function (i, v) {

            var $v = $(v);
            options["workerSalarys[" + i + "].wsId"] = $v.attr('value');

        });

        com.post(api.salary.adoptWorkerSalary, options, function () {
            searcher.doSearch();
        }, function () {
            com.showAlert(com.error, "工费状态不可操作");
        });

    });

    com.post(api.ds.salary, {}, function (data) {
        var SalaryType = data.SalaryType;

        if (SalaryType && SalaryType.length) {
            $.each(SalaryType, function (i, v) {
                $('<option></option>').attr("value", v.key).html(v.name).appendTo($("#workersalarySubtype"));
            });
        }
    }, null, false);


    function saveData(options) {

       if( !com.validate("workersalaryModal")) {

           var url = api.salary.addWorkerSalary;
           var options = {};

           if ($("#workersalarySubtype").val() == 1 || $("#workersalarySubtype").val() == 2 || $("#workersalarySubtype").val() == 3
               || $("#workersalarySubtype").val() == 10 || $("#workersalarySubtype").val() == 11 || $("#workersalarySubtype").val() == 12
               || $("#workersalarySubtype").val() == 13

           ) {
               options["workerSalary.type"] = 0;
           } else if ($("#workersalarySubtype").val() == 4 && $('#workersalary').val() > 0) {
               options["workerSalary.type"] = 0;
           } else {
               options["workerSalary.type"] = 1;
           }
           options["workerSalary.user.userId"] = $('#workersalaryuser').val();
           options["workerSalary.salary"] = $('#workersalary').val();
           options["workerSalary.subtype"] = $("#workersalarySubtype").val();
           options["workerSalary.comment"] = $("#workersalarycomment").val();

           com.post(url, options, function () {
               searcher.doSearch();
           });

           $('#workersalaryModal').modal('hide');
       }

    }

    function deletebystatus(wsId) {

        com.post(api.salary.deleteWorkerSalary, {

            "workerSalary.wsId": wsId

        }, function () {
            searcher.doSearch();
        }, function () {
            com.showAlert(com.error, "工费状态不可操作");
        });
    }

    function adopt(wsId) {

        var options = {};

        options["workerSalarys[0].wsId"] = wsId;

        com.post(api.salary.adoptWorkerSalary, options, function () {
            searcher.doSearch();

        }, function () {
            com.showAlert(com.error, "工费状态不可操作");
        });
    }

    function refuse(wsId) {

        var options = {};

        options["workerSalarys[0].wsId"] = wsId;

        com.post(api.salary.rejectWorkerSalary, options, function () {
            searcher.doSearch();

        }, function () {
            com.showAlert(com.error, "工费状态不可操作");
        });
    }

    $('#import').Huploadify({

        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout':config.uploadTimeout, // 超时时间
        'formData':{
            'uploadType':4
        },
        'buttonClass': 'btn btn-success col-sm-12',
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.host + 'importWorkerSalary.do', // 上传处理程序
        'height':'30', // 浏览按钮的高度
        'fileTypeDesc':'支持的格式：',  // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.xls;*.xlsx', // 允许上传的文件后缀
        'fileSizeLimit':'2MB', // 上传文件的大小限制
        'queueSizeLimit' : 1, // 上传数量
        'onUploadSuccess':function(file, data, response){ //上传到服务器，服务器返回相应信息到data里

            var dateObj = eval("("+data+")");
            searcher.doSearch();

        }
    });

    $('#batchImport').Huploadify({

        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout':config.uploadTimeout, // 超时时间
        'formData':{
            'uploadType':4
        },
        'buttonClass': 'btn btn-success col-sm-12',
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.host + 'batchImportWorkerSalary.do', // 上传处理程序
        'height':'30', // 浏览按钮的高度
        'fileTypeDesc':'支持的格式：',  // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.xls;*.xlsx', // 允许上传的文件后缀
        'fileSizeLimit':'2MB', // 上传文件的大小限制
        'queueSizeLimit' : 1, // 上传数量
        'onUploadSuccess':function(file, data, response){ //上传到服务器，服务器返回相应信息到data里

            var dateObj = eval("("+data+")");

        }
    });

});
