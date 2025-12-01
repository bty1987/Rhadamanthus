$(function() {

    com.focusPage('#fl-statement').statement("子功能区", "报价项配置");

    var functionArea = {

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            textBtn: com.focusPage("#textBtn").on("click", drawtext),
            radioBtn: com.focusPage("#radioBtn").on("click", function() {

                drawradio("radio");
            }),
            checkBtn: com.focusPage("#checkBtn").on("click", function() {

                drawradio("check");
            }),
            inputBtn: com.focusPage("#inputBtn").on("click", drawinput),

            saveOtemBtn: com.focusPage("#saveOtemBtn").on("click", saveOtemData),
        },

        modals: {
            functionAreaModal: com.focusPage("#functionAreaModal"),
            functionAreaOtemModal:  com.focusPage("#functionAreaOtemModal"),
        },

        items: {
            faid: com.focusPage("#faid"),
            no: com.focusPage("#no"),
            name: com.focusPage("#name"),
            versionId: com.focusPage("#versionId"),
            functionAreaType: com.focusPage("#functionAreaType"),
            functionAreaOrder: com.focusPage("#functionAreaOrder"),
            type: com.focusPage("#type"),
            total: com.focusPage("#total"),

            itemlist: com.focusPage("#itemlist", "#functionAreaOtemModal"),
        },

        postParam: {},
    };

    $.extend(com.validator, functionArea.validator);

    functionArea.items.type.bindData(constant.data().functionArea.type.datas, 'key', 'value');

    com.post(api.quotation.queryQuotationVersion, {}, function(res) {

        functionArea.items.versionId.bindData(res.quotationVersions, "no", "name");
    });

    functionArea.modals.functionAreaModal.on("hide.bs.modal", function(a) {

        com.clearValidator();
        com.cleanItems(functionArea.items);
    });

    functionArea.modals.functionAreaOtemModal.on('hide.bs.modal', function(e) {

        com.cleanItems(functionArea.items);
        com.focusPage("#itemlist").html("");
        com.clearValidator();
        com.closeTip();
    });

    functionArea.btns.saveBtn.on("click", saveFunctionArea);

    functionArea.items.type.on('change', function() {

        if ($(this).val() == "2") {
            functionArea.items.total.addClass('v_required').removeAttr('disabled');
        } else {
            functionArea.items.total.removeClass('v_required').attr('disabled', 'disabled').val(0);
        }
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnOtem = $('<a></a>').addClass('btn btn-minier btn-pink').html('量房参数');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');
            var $btnAssign = $('<a></a>').addClass('btn btn-minier btn-warning').html('分配报价项');

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                "type": "checkbox"
            });
            var $span = $('<span></span>').addClass('lbl status-lbl');

            var propertyArr = [["编号: ", v.no, "grey"], ["报价版本: ", v.version.no, "grey"], ["类型: ", v.functionAreaType, "red"], ["总价: ", v.total, "blue"], ["排序: ", v.functionAreaOrder, "blue"], ["状态: ", constant.data().functionArea.status.keys[v.status], "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnOtem).append($btnEdit).append($btnAssign).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnOtem.click(function() {

                params.data.functionArea = v;

                functionAreaOtem(v);
            });

            $btnEdit.click(function() {

                com.showConfirm("功能区的类型修改,会清空以前包含的报价项,是否确认修改?", function() {

                    editFunctionArea(v);
                });
            });

            $btnAssign.click(function() {

                params.data.functionArea = v;

                com.popup4page("#functionAreaItemPopUp", "/views/quotation/functionAreaItem.html", "功能区-报价项");
            });

            $btnDel.click(function() {

                removeFunctionArea(v.faid);
            });

            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click", function() {

                $statusSwitch.prop("checked") ? (updateFunctionAreaStatus(v.faid, 0, function() {

                    $statusSwitch.removeAttr("checked");
                })) : (updateFunctionAreaStatus(v.faid, 1, function() {

                    $statusSwitch.prop("checked");
                }));
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    var _condArr = ['data-quotation-functionArea-name', 'data-quotation-version'];

    var searcher = new Searcher();
    searcher.init(_condArr, "condList", api.quotation.pageFunctionArea, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "functionAreaPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addFunctionArea').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    // 功能区添加按钮
    com.focusPage('a[name="addFunctionArea"]', '#pagenation').on('click', function() {

        functionArea.items.faid.val(0);

        functionArea.items.no.css("display", "none");
        functionArea.items.versionId.removeAttr("disabled");

        functionArea.items.total.attr("disabled", "disabled").val(0);

        functionArea.modals.functionAreaModal.modal("show");
    });

    // 功能区编辑按钮
    function editFunctionArea(v) {

        functionArea.items.faid.val(v.faid);
        functionArea.items.no.val(v.no);
        functionArea.items.name.val(v.name);
        functionArea.items.functionAreaOrder.val(v.functionAreaOrder);
        functionArea.items.functionAreaType.val(v.functionAreaType);
        functionArea.items.versionId.val(v.version.no);
        functionArea.items.type.val(v.type);

        if (v.type == 2) {
            functionArea.items.total.val(v.total).removeAttr("disabled");
        } else {
            functionArea.items.total.attr("disabled", "disabled").val(0);
        }

        functionArea.items.no.css("display", '').attr("disabled", "disabled");
        functionArea.items.versionId.attr("disabled", "disabled")

        functionArea.modals.functionAreaModal.modal("show");
    }

    // 功能区保存按钮点击事件
    function saveFunctionArea() {

        if (com.validate("functionAreaModal"))
            return false;

        var versionId = functionArea.items.versionId.val();

        var url = api.quotation.addFunctionArea;
        var options = {
            "functionArea.no": functionArea.items.no.val(),
            "functionArea.name": functionArea.items.name.val(),
            "functionArea.functionAreaOrder": functionArea.items.functionAreaOrder.val(),
            "functionArea.functionAreaType": functionArea.items.functionAreaType.val(),
            "functionArea.version.no": versionId,
            "functionArea.type": functionArea.items.type.val(),
            "functionArea.total": functionArea.items.total.val()
        };

        if (functionArea.items.faid.val() != '0') {
            url = api.quotation.updateFunctionArea;
            options["functionArea.faid"] = functionArea.items.faid.val();
        }

        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            functionArea.modals.functionAreaModal.modal("hide");
        });
    }

    // 功能区删除事件
    function removeFunctionArea(faid) {

        com.showConfirm("是否确认删除", function() {

            com.post(api.quotation.deleteFunctionArea, {
                "functionArea.faid": faid
            }, function() {

                com.showAlert(com.info, "操作成功");

                searcher.doSearch();
            });
        });
    }

    function updateFunctionAreaStatus(faid, status, failcallBack) {

        com.post(api.quotation.updateFunctionAreaForStatus, {
            "functionArea.faid": faid,
            "functionArea.status": status
        },function(){

        	com.showAlert(com.info, "操作成功");

        	searcher.doSearch();
        });
    }

    function functionAreaOtem(v) {

        com.post(api.quotation.queryFunctionAreaOtem, {
            "functionAreaOtem.faid": v.faid
        }, function(res) {

            $.each(res.functionAreaOtems, function(i, v) {

                v.sort = v.sort || i + 1;
                if (v.type == 0) {
                    drawtext(v);
                } else if (v.type == 1) {
                    drawinput(v);
                } else if (v.type == 2) {
                    drawradio("radio", v);
                } else if (v.type == 3) {
                    drawradio("check", v);
                }
            });
        });

        functionArea.modals.functionAreaOtemModal.modal("show");
    }

    function drawtext(v) {

        var group = $('<div class="form-group typetext typeitem"></div>').appendTo(functionArea.items.itemlist);

        var titleDiv = $('<div class="col-md-12" style="margin-top: 10px; display: flex; align-items: center;"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("文本内容").appendTo(titleDiv);
        var item = $('<div class="col-md-6"></div>').appendTo(titleDiv);
        var input = $('<textarea type="text" style="height: 100px;" class="col-xs-8 m-wrap v_required">').val(v.content).appendTo(item);
        var btnGroup = $('<div style="display: flex; margin-left: auto;"></div>').appendTo(titleDiv);

        var moveUpBtn = $('<button class="btn btn-minier btn-info move-up" style="margin-left:5px"><i class="icon-arrow-up"></i></button>');
        var moveDownBtn = $('<button class="btn btn-minier btn-info move-down" style="margin-left:5px"><i class="icon-arrow-down"></i></button>');
        var deleteBtn = $('<button class="btn btn-minier btn-danger" style="margin-left:5px">删除</button>').appendTo(btnGroup);

        var requireDiv = $('<div class="col-md-12" style="margin-top: 10px"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("是否必填").appendTo(requireDiv);
        var item = $('<div class="col-md-8"></div>').appendTo(requireDiv);
        var require = $('<input type="checkbox" name="require" class=" ace ace-switch ace-switch-5" />').appendTo(item);
        var span = $('<span class="lbl isOrNot"></span>').appendTo(item);

        if (v != null && v.require == 0) {
            require.prop('checked', true);
        }

        moveUpBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'up');
            return false;
        });

        moveDownBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'down');
            return false;
        });

        deleteBtn.click(function() {

            var _group = $(this).parents(".typetext");
            var _hr = _group.next("hr");

            _hr.remove();
            _group.remove();

            return false;
        });

        $('<hr/>').appendTo(functionArea.items.itemlist);
    }

    function drawradio(type, v) {

        var group = $('<div class="form-group typeitem"></div>').addClass("type" + type).appendTo(functionArea.items.itemlist);

        var titleDiv = $('<div class="col-md-12" style="margin-top: 10px; display: flex; align-items: center;"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("题目").appendTo(titleDiv);
        var item = $('<div class="col-md-6"></div>').appendTo(titleDiv);
        var input = $('<input type="text" class="col-xs-8 m-wrap title v_required"></div>').val(v ? v.name : "").appendTo(item);
        var btnGroup = $('<div style="display: flex; margin-left: auto;"></div>').appendTo(titleDiv);

        var moveUpBtn = $('<button class="btn btn-minier btn-info move-up" style="margin-left:5px"><i class="icon-arrow-up"></i></button>');
        var moveDownBtn = $('<button class="btn btn-minier btn-info move-down" style="margin-left:5px"><i class="icon-arrow-down"></i></button>');
        var deleteBtn = $('<button class="btn btn-minier btn-danger" style="margin-left:5px">删除</button>').appendTo(btnGroup);

        var requireDiv = $('<div class="col-md-12" style="margin-top: 10px"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("是否必填").appendTo(requireDiv);
        var item = $('<div class="col-md-8"></div>').appendTo(requireDiv);
        var require = $('<input type="checkbox" name="require" class=" ace ace-switch ace-switch-5" />').appendTo(item);
        var span = $('<span class="lbl isOrNot"></span>').appendTo(item);
        
        var radioDiv = $('<div class="col-md-12" style="margin-top: 10px"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("选项内容").appendTo(radioDiv);
        var item = $('<div class="col-md-8"></div>').appendTo(radioDiv);

        var input = $('<input type="text" class="col-xs-8 m-wrap" id="event"></div>').appendTo(item);
        var btn = $('<button class="btn btn-minier btn-yellow"></button>').text("添项").appendTo(item);

        var optionDiv = $('<div class="col-md-12" style="margin-top: 10px"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right option" style="margin-top: 10px" for="name"></label>').html("所有选项").appendTo(optionDiv);
        var items = $('<div class="col-md-8 items" style="margin-top: 10px" id="seleted"></div>').appendTo(optionDiv);

        if (v != null && v.require == 0) {
            require.prop('checked', true);
        }

         moveUpBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'up');
            return false;
        });

        moveDownBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'down');
            return false;
        });

        deleteBtn.click(function() {

            var _group = $(this).parents("." + "type" + type);
            var _hr = _group.next("hr");

            _hr.remove();
            _group.remove();

            return false;
        });

        btn.click(function() {

            var that = $(this);

            var input = that.prev();
            var items = that.parents(".form-group").find(".items");

            if (input.val() == '')
                return false;

            var item = $('<span class="label label-xlg label-primary option" style="margin-right: 5px; margin-top: 10px"></span>').text(input.val()).appendTo(items);
            var itemdel = $('<i class="icon-remove red"></i>').appendTo(item);

            com.focusPage("#event").val("");

            itemdel.click(function() {

                var that = $(this);
                var span = that.parent();

                span.remove();
            });

            return false;
        });

        $('<hr/>').appendTo(functionArea.items.itemlist);

        if (v) {
            $.each(v.options, function(i, v) {

                var item = $('<span class="label label-xlg label-primary option" style="margin-right: 5px;"></span>').text(v.title).appendTo(items);
                var itemdel = $('<i class="icon-remove red"></i>').appendTo(item);

                itemdel.click(function() {

                    var that = $(this);
                    var span = that.parent();

                    span.remove();
                });
            });
        }
    }

    function drawinput(v) {

        var group = $('<div class="form-group typeinput typeitem"></div>').attr({'data-stiid': v.stiid || '','data-sort': v.sort || $(".typeitem").length + 1}).appendTo(functionArea.items.itemlist);

        var titleDiv = $('<div class="col-md-12" style="margin-top: 10px; display: flex; align-items: center;"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("文本内容").appendTo(titleDiv);
        var item = $('<div class="col-md-6"></div>').appendTo(titleDiv);
        var input = $('<textarea type="text" style="height: 100px;" class="col-xs-8 m-wrap v_required">').val(v.name).appendTo(item);
        var btnGroup = $('<div style="display: flex; margin-left: auto;"></div>').appendTo(titleDiv);

        var moveUpBtn = $('<button class="btn btn-minier btn-info move-up" style="margin-left:5px"><i class="icon-arrow-up"></i></button>');
        var moveDownBtn = $('<button class="btn btn-minier btn-info move-down" style="margin-left:5px"><i class="icon-arrow-down"></i></button>');
        var deleteBtn = $('<button class="btn btn-minier btn-danger" style="margin-left:5px">删除</button>').appendTo(btnGroup);

        var requireDiv = $('<div class="col-md-12" style="margin-top: 10px"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("是否必填").appendTo(requireDiv);
        var item = $('<div class="col-md-8"></div>').appendTo(requireDiv);
        var require = $('<input type="checkbox" name="require" class=" ace ace-switch ace-switch-5" />').appendTo(item);
        var span = $('<span class="lbl isOrNot"></span>').appendTo(item);

        if (v != null && v.require == 0) {
            require.prop('checked', true);
        }

        moveUpBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'up');
            return false;
        });

        moveDownBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'down');
            return false;
        });

        deleteBtn.click(function() {

            var _group = $(this).parents(".typeinput");
            var _hr = _group.next("hr");

            _hr.remove();
            _group.remove();

            return false;
        });

        $('<hr/>').appendTo(functionArea.items.itemlist);
    }

    function saveOtemData() {

        if (com.validate("functionAreaOtemModal"))
            return false;

        if (com.focusPage("#itemlist").html().length == 0) {

            com.showAlert(com.info, "请填写题目后再点击保存");
            return false;
        }

        var args = {
        	"functionAreaOtem.faid": params.data.functionArea.faid
        };

        com.focusPage("#itemlist").find(".typeitem").each(function(i, v) {

            var item = $(v);

            if (item.hasClass("typetext")) {

                args["functionAreaOtems[" + i + "].name"] = "";
                args["functionAreaOtems[" + i + "].type"] = 0;
                args["functionAreaOtems[" + i + "].content"] = item.find("textarea").val();
                args["functionAreaOtems[" + i + "].require"] = 1;

            } else if (item.hasClass("typeradio") || item.hasClass("typecheck")) {

                var type = item.hasClass("typeradio") ? 2 : 3;

                args["functionAreaOtems[" + i + "].name"] = item.find("input").val();
                args["functionAreaOtems[" + i + "].type"] = type;
                args["functionAreaOtems[" + i + "].content"] = "";
                args["functionAreaOtems[" + i + "].require"] = item.find('input[name="require"]').prop("checked") ? 0 : 1;

                var options = item.find("span.option");

                options.each(function(j, e) {

                    var option = $(e);

                    args["functionAreaOtems[" + i + "].options[" + j + "].title"] = option.text();
                });

            } else if (item.hasClass("typeinput")) {

                args["functionAreaOtems[" + i + "].name"] = item.find("textarea").val();
                args["functionAreaOtems[" + i + "].type"] = 1;
                args["functionAreaOtems[" + i + "].content"] = "";
                args["functionAreaOtems[" + i + "].require"] = item.find('input[name="require"]').prop("checked") ? 0 : 1;
            }
        });

        com.post(api.quotation.makeFunctionAreaOtem, args, function() {

            searcher.doSearch();

            functionArea.modals.functionAreaOtemModal.modal("hide");
        });
    }
});
