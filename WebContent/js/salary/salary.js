$(function () {

    var salary = {
        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),

        modals: {
             salaryModal: com.focusPage("#salaryModal")
        },
        items: {
        	salaryuser:com.focusPage("#salaryuser"),
        	money : com.focusPage("#money"),
    		type : com.focusPage("#type1"),
    		salaryOnetype : com.focusPage("#type2"),
        	salaryTwotype : com.focusPage("#type3"),
        	salaryThrType : com.focusPage("#type4"),
            salarycomment : com.focusPage("#salarycomment")
        },

        status:{},
        type:{},
    };

    salary.saveBtn.bindClick(saveData);
    salary.modals.salaryModal.on('hide.bs.modal', function (e) {
		com.cleanTypeahead('salaryuser');
     	com.closeTip();
        com.cleanItems(salary.items);
    });

    com.initTypeahead('salaryuser', api.personel.queryUserByPinyin, "pinyinName", {"user.status": "0"}, "autoFillKeyValue", "key", "value",function(list,key,value){
        return value;
    });

    com.post(api.ds.salary, {}, function (data) {

        salary.status=data.status.split("key", "value");
        salary.type=data.type.split("id", "name");

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnadopt = $('<a></a>').addClass('btn btn-minier btn-yellow').html('通过');
            var $btnreject = $('<a></a>').addClass('btn btn-minier btn-success').html('拒绝');
            var $btncancel = $('<a></a>').addClass('btn btn-minier btn-warning').html('撤销');

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var propertyArr = [
                ["类型:", salary.type[v.type], "red"],
                ["操作金额:", v.money, "blue"],
                ["创建时间:", v.createTime, "green"],
                ["状态:", salary.status[v.status], "red"],
                ["操作人:", v.operater.currentName, "grey"],
                ["操作时间:", v.operateTime, "green"],
                ["说明:", v.comment, "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
                $label.appendTo($h3);
            });

            var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.user.currentName);

            _label.append(_span).appendTo($label);

            $divBtnWrap.append($btnadopt).append($btnreject).append($btncancel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnadopt.click(function () {
                adoptstatus(v.sid);
            });

            $btnreject.click(function () {
                rejectstatus(v.sid);
            });

            $btncancel.click(function () {
                cancelstatus(v.sid);
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

    var _condArr = ['s_user', 's_status', 'cerateTime', 'operateTime'];
    searcher.init(_condArr, "condList", api.salary.pageSalary, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "salaryPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-blue').attr('name', 'add').css("margin", "0px 3px");
        var $addai = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addaspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('a[name="add"]', '#pagenation').on("click", function () {

        salary.modals.salaryModal.modal("show");

        cleanType([1, 2, 3, 4]);
        com.post(api.ds.salary, {}, function (res) {
            $.each(res.type, function (i, v) {
                salary.items.type.append($('<option value="' + v['id'] + '">' + v['name'] + '</option>'));
            });
            salary.items.type.change(function () {
                cleanType([2, 3, 4]);
                $.each(res.twoType, function (i, v) {
                    if (salary.items.type.val() == v['oneType']) {
                        salary.items.salaryOnetype.append($('<option value="' + v['id'] + '">' + v['name'] + '</option>'));
                    }
                });
            });
            salary.items.salaryOnetype.change(function () {
                cleanType([3, 4]);
                $.each(res.thrType, function (i, v) {
                    if (salary.items.salaryOnetype.val() == v['twoType']) {
                        salary.items.salaryTwotype.append($('<option value="' + v['id'] + '">' + v['name'] + '</option>'));
                    }
                });
            });
            salary.items.salaryTwotype.change(function () {
                cleanType([4]);
                $.each(res.forType, function (i, v) {
                    if (salary.items.type.val() == v['oneType'] && salary.items.salaryTwotype.val() == v['thrType']) {
                        salary.items.salaryThrType.append($('<option value="' + v['id'] + '">' + v['name'] + '</option>'));
                    }
                });
            });
        });
    });

    function adoptstatus(sid) {

        var options = {};

        options["salary.sid"] = sid;

        com.post(api.salary.passSalary, options, function () {
            searcher.doSearch();

        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        });
    }

    function rejectstatus(sid) {

        var options = {};

        options["salary.sid"] = sid;

        com.post(api.salary.rejectSalary, options, function () {
            searcher.doSearch();

        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        });
    }

    function cancelstatus(sid) {

        var options = {};

        options["salary.sid"] = sid;

        com.post(api.salary.cancelSalary, options, function () {
            searcher.doSearch();
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        });
    }

    function cleanType(num) {
        $.each(num, function (i, v) {
            com.focusPage("#type" + v + "").empty();
            com.focusPage("#type" + v + "").append($('<option value="">请选择</option>'));
        });
    }

    function saveData() {

        if (!com.validate("salaryModal")) {

            var options = {
                "salary.user.userId": com.typeahead("salaryuser"),
                "salary.type": salary.items.type.val(),
                "salary.onetype": salary.items.salaryOnetype.val(),
                "salary.twotype": salary.items.salaryTwotype.val(),
                "salary.thrtype": salary.items.salaryThrType.val(),
                "salary.money": salary.items.money.val(),
                "salary.comment": salary.items.salarycomment.val()
            };
            com.post(api.salary.addSalary, options, function (res) {
                searcher.doSearch();
                com.showAlert(com.info, "添加成功");
            });
            salary.modals.salaryModal.modal("hide");
        }
    }

});
