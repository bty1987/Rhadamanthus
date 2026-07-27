jQuery(function($) {

    // 从父页面(supervision4detail)传入的上下文
    var ctx = params.workerSalary || {};

    var workerSalary4detail = {

        salaryStatus: {},
        oneTypeMap: {}, // twotype -> onetype 映射, 用于新增时传 onetype
        twoTypeMap: {}, // twotype -> name 映射, 用于列表显示
        twoTypes: [],

        validator: {
            salary: {
                type: "v_salary",
                regex: /^-?(([1-9]\d{0,6})|(([1-9]\d{0,6}\.\d{1,3})|(0\.[1-9]{1,3})))$/,
                errorMsg: "请正确输入工人工费，小数点后最多保留3位"
            }
        }
    };

    $.extend(com.validator, workerSalary4detail.validator);

    // 加载薪资枚举 (状态/类型)
    com.post(api.ds.salary, {}, function(res) {

        workerSalary4detail.salaryStatus = res.status.split("key", "value");
        workerSalary4detail.oneTypeMap = res.SalaryTwoType.split("key", "oneType");
        workerSalary4detail.twoTypeMap = res.SalaryTwoType.split("key", "name");
        workerSalary4detail.twoTypes = res.SalaryTwoType;

        // 填充类型下拉: 仅 status==0 (启用) 的选项
        var $select = com.focusPage("#ws4dSalaryType");
        $.each(res.SalaryTwoType, function(i, v) {

            if (v.status != 0)
                return true;

            $("<option></option>").attr("value", v.key).html(v.name).appendTo($select);
        });
    }, null, false);

    com.focusPage("#ws4dSaveBtn").bindClick(saveData);

    // 查询并渲染工费列表
    queryWorkerSalaryList();

    function queryWorkerSalaryList() {

        var $list = com.focusPage("#ws4dList").html("");

        var options = {
            "workerSalary.csid": ctx.csid,
            "workerSalary.user.userId": ctx.userId
        };

        com.post(api.salary.queryWorkerSalary, options, function(res) {

            if (!res.workerSalarys || res.workerSalarys.length == 0) {
                $('<div class="alert alert-info">').text("当前节点没有工费记录").appendTo($list);
                return;
            }

            $.each(res.workerSalarys, function(i, v) {

                var $item = $('<div class="form-group"></div>').attr("id", "salary" + i);

                $item.append(addSpan('姓名', v.user.userName))
                    .append(addSpan('创建时间', v.createTime))
                    .append(addSpan('薪资', v.money))
                    .append(addSpan('类型', workerSalary4detail.twoTypeMap[v.twotype]))
                    .append(addSpan('状态', workerSalary4detail.salaryStatus[v.status]));

                // 状态为初始(0)的允许删除
                if (v.status == constant.salary().salary.status.STATUS_INIT_INT) {
                    $('<button>删除</button>')
                        .addClass("btn btn-xs btn-danger pull-right")
                        .css("margin-left", "15px")
                        .on("click", function() {

                            com.post(api.salary.deleteWorkerSalary, {
                                "workerSalary.wsId": v.wsId
                            }, function() {

                                $item.remove();
                            }, function(res) {

                                com.showAlert(com.error, "工费状态不可操作!");
                            });
                        }).appendTo($item);
                }

                $item.append('<hr/>').appendTo($list);
            });
        }, null, false);
    }

    function addSpan(name, value) {

        return $('<div></div>').css({
            'display': 'inline-block',
            'margin-left': '20px'
        }).append($('<b></b>').html(name + ": ")).append($('<span></span>').text(value));
    }

    function saveData() {

        if (com.validate("ws4dForm")) {
            return false;
        }

        var salary = com.focusPage("#ws4dSalary").val();
        var twotype = com.focusPage("#ws4dSalaryType").val();

        var options = {
            "workerSalary.csid": ctx.csid,
            "workerSalary.user.userId": ctx.userId,
            "workerSalary.money": salary,
            "workerSalary.type": salary >= 0 ? 0 : 1,
            "workerSalary.onetype": workerSalary4detail.oneTypeMap[twotype],
            "workerSalary.twotype": twotype,
            "workerSalary.comment": com.focusPage("#ws4dComment").val()
        };

        com.post(api.salary.addWorkerSalary, options, function() {

            com.showAlert(com.info, "操作成功");
            com.focusPage("#ws4dSalary").val("");
            com.focusPage("#ws4dComment").val("");
            queryWorkerSalaryList();
        });
    }

});
