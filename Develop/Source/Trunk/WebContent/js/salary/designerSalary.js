
jQuery(function ($) {

    var designersalary = {

        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        editFlg: false

    };

    designersalary.saveBtn = $("#saveBtn").on("click", saveData);
    designersalary.updatadesignersalary =$("#updatadesignersalary").on("click",updatadesignersalary);
    designersalary.cancelBtn = $("#cancelBtn");
    designersalary.modal = $("#designersalaryModal");
    designersalary.modal.designersalaryuser = $("#designersalaryuser");
    designersalary.modal.designersalary = $("#designersalary");
    designersalary.modal.uid = $("#uid");
    designersalary.modal.user = $("#user");
    designersalary.modal.dsid = $("#dsid");
    designersalary.modal.salary = $("#salary");


    $.extend(com.validator, designersalary.validator);


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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.duser.userName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $adopt = $('<a></a>').addClass('btn btn-minier btn-primary').html('通过');
            var $btnrefuse = $('<a></a>').addClass('btn btn-minier btn-danger').html('驳回');
            var $btnuptl = $('<a></a>').addClass('btn btn-minier btn-inverse').html('修改');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-inverse').html('删除');


            var propertyArr = [
                ["创建人:", v.cuser.userName, "grey"],
                ["创建时间:", v.createTime, "grey"],
                ["审批人:", v.auser.userName == null ? "无" : v.auser.userName, "grey"],
                ["审批时间:", v.approveTime == null ? "无" : v.approveTime, "grey"],
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
            $divBtnWrap.append($adopt).append($btnrefuse).append($btnuptl).append($btnDel).appendTo($h3);
            $label.append($input).append($span).prependTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnDel.click(function () {

                deletebystatus(v.dsid);


            });
            $btnuptl.click(function () {

                $('#updataModal').modal("show");
                designersalary.modal.dsid.val(v.dsid);
                designersalary.modal.user.val(v.duser.userName);
               designersalary.modal.salary.val(v.salary);

            });



            $adopt.click(function () {

                adopt(v.dsid);


            });
            $btnrefuse.click(function () {

                refuse(v.dsid);

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
        }
    })();

    var searcher = new Searcher();
    var _condArr = ['jober' ,'salarystatus','cerateTime', 'approveTime'];

    searcher.init(_condArr, "condList", api.salary.pageDesignerSalary, function (data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "workersalaryPostData", null, false, null, function () {


        var $selecta = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'select').css("margin", "0px 3px");
        var $selecti = $('<i></i>').addClass('icon-plus bigger-110').appendTo($selecta);
        var $selectspan = $('<span></span>').text('全选').appendTo($selecta);


        var $adda = $('<a></a>').addClass('btn btn-minier btn-success').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('创建').appendTo($adda);

        var $exporta = $('<a></a>').addClass('btn btn-minier ' ).attr('name', 'export').css("margin", "0px 3px");
        var $exporti = $('<i></i>').addClass('icon-download-alt bigger-110' ).appendTo($exporta);
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

    //全选
    $('a[name="select"]').on("click", function () {

        if ($('input[type="checkbox"]').prop('checked')) {
            $('input[type="checkbox"]').removeAttr('checked');
            $('input[type="checkbox"]').prop('checked', false)

        } else {
            $('input[type="checkbox"]').attr('checked', true);
            $('input[type="checkbox"]').prop('checked', true)

        }
    });
    //创建
    $('a[name="add"]', '#pagenation').on("click", function () {

        com.cleanItems(designersalary.items);
        $('#designersalaryModal').modal("show");
        com.initChosen('designersalaryuser', api.personel.queryUserForNameByPinyinName, "pinyinName", {"userNamePinYin": $("#designersalaryuser").val()}, "autoFillKeyValue", "key", "value");

        designersalary.modal.uid.val($("#designersalaryuser").duser.uid);
    });


    $('a[name="import"]', '#pagenation').on("click", function () {

        $('#importModal').modal("show");
    });

    $('a[name="batchImport"]', '#pagenation').on("click", function () {
        $('#batchImportModal').modal("show");

    });
    // 导出
    $('a[name="export"]', '#pagenation').on("click", function () {


        if ($('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if ($('span[name="totalRecords"]').text() > 500) {
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
                    ['类型', 'subtype'],
                    ['备注', 'comment'],
                    ['状态',"status"]
                ],
                list: res.paging.data,

            }, function (v) {

                v.approver.userName = v.approver.userName == null ? "" : v.approver.userName;
                v.comment = v.comment == null ? "" : v.comment;
                v.decorationOrder.supervisor = v.decorationOrder.supervisor == null ? "" : v.decorationOrder.supervisor;
                v.decorationOrder.orderId = v.decorationOrder.orderId == null ? "" : v.decorationOrder.orderId;
                v.decorationOrder.village = v.decorationOrder.village == null ? "" : v.decorationOrder.village.villageName;
                v.decorationOrder.houseNumber = v.decorationOrder.houseNumber == null ? "" : v.decorationOrder.houseNumber

                switch (v.subtype) {

                    case 1 :
                        v.subtype = "工费";
                        break;
                    case 2 :
                        v.subtype = "增项";
                        break;
                    case 3 :
                        v.subtype = "油工一级奖励";
                        break;
                    case 4 :
                        v.subtype = "维修款";
                        break;
                    case 5 :
                        v.subtype = "罚款";
                        break;
                    case 6 :
                        v.subtype = "工程质保金";
                        break;
                    case 7 :
                        v.subtype = "工具押金";
                        break;
                    case 8 :
                        v.subtype = "借款";
                        break;
                    case 9 :
                        v.subtype = "工人家属保险";
                        break;

                }
            });
        })

    });
    //通过
    $('a[name="adopt"]', '#pagenation').on("click", function (v) {

        var options = {};
        var groupCheckbox = $('input[name="check"]:checked');

        $.each(groupCheckbox, function (i, v) {

            var $v = $(v);
            options["workerSalarys[" + i + "].wsId"] = $v.attr('value')

        });

        com.post(api.salary.adoptWorkerSalary, options, function (res) {
            searcher.doSearch();
        })

    });

    com.post(api.ds.salaryType, {}, function (data) {
        var SalaryType = data.SalaryType;

        if (SalaryType && SalaryType.length) {
            $.each(SalaryType, function (i, v) {
                $('<option></option>').attr("value", v.key).html(v.name).appendTo("#workersalarySubtype");
            })
        }
    }, null, false);


    function saveData() {
        com.post(api.personel.queryUserByUserId,{"user.userId": $("#designersalaryuser").val()},
            function (res) {
           var  uid =   res.user.uid;

                com.post(api.salary.adddesignerSalary, {


                    "designerSalary.duser.uid" :  uid,

                    "designerSalary.salary" :designersalary.modal.designersalary.val()

                },function (res) {

                        searcher.doSearch();
                        $('#designersalaryModal').modal("hide")
                    }
                    ,function (res) {

                        searcher.doSearch();
                    })


                    }

        )};

function updatadesignersalary() {

    com.post(api.salary.updatedesignerSalary, {

        "designerSalary.dsid":   designersalary.modal.dsid.val(),
        "designerSalary.salary": designersalary.modal.salary.val()

    }, function (dat) {
        searcher.doSearch();
        $('#updataModal').modal("hide");

    }, function (data) {
        com.showAlert(com.error, "工费状态不可操作")
    });
}


    function deletebystatus(dsid) {
        com.post(api.salary.deletedesignerSalary, {

            "designerSalary.dsid": dsid

        }, function (dat) {
            searcher.doSearch();
        }, function (data) {
            com.showAlert(com.error, "工费状态不可操作")
        });
    }

    function adopt(dsid) {

        var options = {};

        options["designerSalarys[0].dsid"] = dsid;
        console.log(options);
        com.post(api.salary.adoptdesignerSalary, options, function (res) {


            searcher.doSearch();

        }, function () {
            com.showAlert(com.error, "工费状态不可操作")
        })
    }

    function refuse(dsid) {

        var options = {};

        options["designerSalarys[0].dsid"] = dsid;



        com.post(api.salary.rejectdesignerSalary, options, function (res) {
            searcher.doSearch();

        }, function () {
            com.showAlert(com.error, "工费状态不可操作")
        })
    }
    $('#import').Huploadify({

        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout':config.uploadTimeout, // 超时时间
        'formData':{
            'uploadType':4,
        },
        'buttonClass': 'btn btn-success col-sm-12',
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.server + 'importWorkerSalary.do', // 上传处理程序
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
            'uploadType':4,
        },
        'buttonClass': 'btn btn-success col-sm-12',
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.server + 'batchImportWorkerSalary.do', // 上传处理程序
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
