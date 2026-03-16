jQuery(function($) {

    var role = {

        items: {

            no: com.focusPage("#roleId"),
            name: com.focusPage("#roleName"),
            content: com.focusPage("#content"),

            chainList: com.focusPage("#chainList"),
            currentchainPage: com.focusPage("#currentchainPage"),

            chartList: com.focusPage("#chartList"),
            currentchartPage: com.focusPage("#currentchartPage"),

            task: com.focusPage("#task", "#taskModal"),
            taskList: com.focusPage("#taskList"),
            taskPermList: com.focusPage("#taskPermList"),

            currentOperation: com.focusPage("#currentOperation"),
            operation: com.focusPage("#operation"),
        },

        modals: {
            roleModal: com.focusPage("#roleModal"),
            moduleModal: com.focusPage("#moduleModal"),
            moduleNewModal: com.focusPage("#moduleNewModal"),
            companyCopyModal: com.focusPage("#companyCopyModal"),
            operationModal: com.focusPage("#operationModal"),
            taskModal: com.focusPage("#taskModal"),
            taskCopyModal: com.focusPage("#taskCopyModal"),

            chainPageModal: com.focusPage("#chainPageModal"),
            chartPageModal: com.focusPage("#chartPageModal"),

        },

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            saveOperationBtn: com.focusPage('button[name="saveBtn"]', '#operationModal').on("click", saveOperation),
            saveModuleBtn: com.focusPage('button[name="saveBtn"]', '#moduleModal').on("click", saveModule),
            saveTaskBtn: com.focusPage('button[name="saveTaskBtn"]').bind('click', saveTask),

            addRoleModuleBtn: com.focusPage('#addRoleModuleBtn').bind('click', addRoleTask),
        },

        validator: {
            roleId: {
                type: "v_roleId",
                regex: /^[\w-_]+$/,
                errorMsg: "请输入数字字母或下划线中划线."
            }
        },

        rid: null,
        system: 1,

        pageType: params['urlLoadParams'].type,

        tasks: {},
    };

    var setting = {
        check: {
            enable: true,
            chkDisabledInherit: true,
            chkboxType: {
                "Y": "s",
                "N": "ps"
            }
        },
        data: {
            simpleData: {
                enable: true
            }
        }
    };

    role.modals.roleModal.on('show.bs.modal', function(e) {

        com.clearValidator();
    });

    $.extend(com.validator, role.validator);

    com.focusPage("#saveRoleRightBtn").on("click", saveRoleRight);
    com.focusPage("#saveChainPageBtn").on("click", saveChainPage);
    com.focusPage("#saveChartPageBtn").on("click", saveChartPage);
    com.focusPage("#saveModuleNewBtn").on("click", saveModuleNew);
    com.focusPage("#confirmCopyBtn").on("click", confirmCopyModule);
    com.focusPage("#taskCopyBtn").on("click", showTaskCopySelectionModal);
    com.focusPage("#confirmTaskCopyBtn").on("click", confirmCopyTask);

    com.post(api.data.queryChainPage, {}, function(res) {

        $.each(res.chainPages, function(i, v) {

            var $tag = $("<div></div>").addClass("tag").appendTo(role.items.chainList);
            var $check = $("<input></input>").attr({
                "type": "checkbox",
                "cpid": v.cpid
            }).addClass("ace").appendTo($tag);
            var $lbl = $("<span></span>").addClass("lbl").appendTo($tag);
            var $span = $("<span></span>").text(v.name).appendTo($tag);
        });
    });

    com.post(api.data.queryChart, {
        "chart.cid": 0
    }, function(res) {

        $.each(res.charts, function(i, v) {

            var $tag = $("<div></div>").addClass("tag").appendTo(role.items.chartList);
            var $check = $("<input></input>").attr({
                "type": "checkbox",
                "cid": v.cid
            }).addClass("ace").appendTo($tag);
            var $lbl = $("<span></span>").addClass("lbl").appendTo($tag);
            var $span = $("<span></span>").text(v.name).appendTo($tag);
        });
    });

    com.post(api.communion.queryTaskForSelf, {

    }, function(res) {

        $.each(res.tasks, function(i, v) {

            var $div = $('<div class="tag"></div>');
            var $input = $('<input/>').attr({
                "type": "checkbox",
                "value": v.name,
                "name": "corporabtask",
                "id": v.tid,
                "class": "ace"
            }).val(v.tid);

            var $span = $('<span></span>').html(v.name).addClass('lbl');

            $input.click(function() {

                var ele = $(this);
                var checked = ele.prop("checked");

                com.post(checked ? api.communion.updateRoleTask : api.communion.deleteRoleTask, {
                    "role.rid": role.rid,
                    'task.tid': ele.val()
                }, function(res) {

                });
            })

            $div.append($input).append($span).appendTo(role.items.taskList);

            com.selectTypeahead(role.items.task, res.tasks, 'tid', 'name', function(list, k, v) {

                var tag = com.focusPage("#" + k, "#taskList");

                if (!tag)
                    return v;

                com.focusPage(".tag", "#taskList").css("background-color", "");
                tag.parent(".tag").css("background-color", "#d6487eac");

                tag.prop("checked", "checked");

                return v;
            });
        });
    }, null, false);

    com.post(api.system.queryOperationForSelf, {
        'operation.system': 1,
        'operation.type': 0,
    }, function(data) {

        $.each(data.operations, function(i, v) {

            if (v.type != 0)
                return true;

            var $div = $('<div class="tag"></div>');

            var $indexInput = $('<input/>').attr({
                type: "checkbox",
                value: v.name,
                name: "operation",
                "id": v.oid,
                class: "ace",
            }).val(v.oid);

            var $span = $('<span></span>').html(v.name).addClass('lbl');

            $indexInput.click(function() {

                var ele = $(this);
                var checked = ele.prop("checked");

                com.post(checked ? api.system.updateRoleOperation : api.system.deleteRoleOperation, {
                    "role.rid": role.rid,
                    'operation.oid': ele.val()
                });
            })

            $div.append($indexInput).append($span).appendTo(role.items.operation);
        });
    }, null, false);

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $chainPage = $('<a></a>').addClass('btn btn-minier btn-yellow').html('外链配置');
            var $btnModule = $('<a></a>').addClass('btn btn-minier btn-success hide').html('模块配置');
            var $btnModuleNew = $('<a></a>').addClass('btn btn-minier btn-purple').html('模块配置');
            var $btnCopyModule = $('<a></a>').addClass('btn btn-minier btn-default').html('模块复制');
            var $btnTask = $('<a></a>').addClass('btn btn-minier btn-danger').html('任务配置');
            var $btnCopyTask = $('<a></a>').addClass('btn btn-minier btn-default').html('任务复制');
            var $officeModule = $('<a></a>').addClass('btn btn-minier btn-info').html('办公配置');
            var $btnOperation = $('<a></a>').addClass('btn btn-minier btn-warning').html('操作配置');
            var $btnChart = $('<a></a>').addClass('btn btn-minier btn-pink').html('图表配置');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-inverse').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [["编号:", v.no, "grey"], ["描述:", v.content, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            if (role.pageType == "advance") {
                $divBtnWrap.append($chainPage).append($btnModule).append($btnModuleNew).append($btnCopyModule).append($btnTask).append($btnCopyTask).append($officeModule).append($btnOperation).append($btnChart).append($btnEdit).append($btnDel).appendTo($h3);
            } else {
                $divBtnWrap.append($btnModule).append($btnModuleNew).append($btnCopyModule).append($btnTask).append($btnCopyTask).appendTo($h3);
            }

            $liLine.append($h3).append($ulProperty);

            $btnModule.click(function() {

                role.rid = v.rid;

                queryModuleByRoleId(v.rid, 1);

                role.modals.moduleModal.modal('show');
            });

            $btnModuleNew.click(function() {

                role.rid = v.rid;

                queryModuleNewByRoleId(v.rid);
            });

            $btnCopyModule.click(function() {

                role.rid = v.rid;

                showCompanySelectionModal(v.rid, v.name);

                $('#companyCopyModal').modal('show');
            });

            $btnTask.bind('click', function(rid) {

                role.rid = v.rid;

                role.items.taskPermList.html("");

                com.focusPage("input[type='checkbox']", "#taskList").prop("checked", false);

                com.post(api.communion.queryTaskByRid, {
                    "role.rid": v.rid
                }, function(res) {

                    $.each(res.tasks, function(i, v) {

                        var $div = $('<div></div>').appendTo(role.items.taskPermList);
                        var $span = $('<span class="tag"></span>').html(v.name).appendTo($div);

                        com.focusPage("#" + v.tid, "#taskList").prop("checked", true);
                    });
                });

                role.modals.taskModal.modal("show");

            });

            $btnCopyTask.click(function() {

                role.rid = v.rid;

                showTaskCopySelectionModal();

            });

            $officeModule.click(function() {

                role.rid = v.rid;

                queryModuleByRoleId(v.rid, 2);

                role.modals.moduleModal.modal('show');
            });

            $btnOperation.click(function() {

                role.rid = v.rid;

                role.items.currentOperation.html("");

                com.focusPage("input[type='checkbox']", "#operation").prop("checked", false);

                // 获取角色的操作
                com.post(api.system.queryOperationByRid, {
                    'operation.system': 1,
                    "role.rid": v.rid
                }, function(data) {

                    if (data.operations.length) {
                        $.each(data.operations, function(i, v) {

                            var $div = $('<div></div>').appendTo(role.items.currentOperation);
                            var $span = $('<span class="tag"></span>').html(v.name).appendTo($div);

                            com.focusPage("#" + v.oid, "#operation").prop("checked", true);

                        });
                    }
                }, null, false);

                role.modals.operationModal.modal('show');
            });

            $btnEdit.unbind().bind('click', function() {

                editRole(v.rid, v.no, v.name, v.content);
            });

            $btnDel.click(function() {

                deleteRole(v.rid);
            });

            $chainPage.click(function() {

                role.rid = v.rid;

                role.items.currentchainPage.html("");
                role.items.chainList.find("input[type='checkbox']").attr("checked", false);

                com.post(api.right.queryRoleChainPageByRid, {
                    "roleChainPage.rid": v.rid
                }, function(res) {

                    $.each(res.chainPages, function(i, v) {

                        var $div = $('<div></div>').appendTo(role.items.currentchainPage);
                        var $span = $('<span class="tag"></span>').html(v.name).appendTo($div);

                        role.items.chainList.find("input[cpid='" + v.cpid + "']").click();
                    });
                });

                role.modals.chainPageModal.modal("show");
            });

            $btnChart.click(function() {

                role.rid = v.rid;

                role.items.currentchartPage.html("");
                role.items.chartList.find("input[type='checkbox']").attr("checked", false);

                com.post(api.data.queryChartByRid, {
                    "role.rid": v.rid
                }, function(res) {

                    $.each(res.charts, function(i, v) {

                        var $div = $('<div></div>').appendTo(role.items.currentchartPage);
                        var $span = $('<span class="tag"></span>').html(v.name).appendTo($div);

                        role.items.chartList.find("input[cid='" + v.cid + "']").click();
                    });
                });

                role.modals.chartPageModal.modal("show");
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
        }
    })();

    var searcher = new Searcher();

    searcher.init(["system-role-no", "system-role-name"], "condList", api.system.pageRole, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "rolePostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addRole').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return role.pageType == "advance" ? [$adda] : [];
    });

    com.focusPage('[name="addRole"]', com.focusPage('#pagenation')).click(function() {

        role.rid = null;

        com.cleanItems(role.roleItems);

        role.items.no.prop("disabled", false).css("display", "none");

        role.modals.roleModal.modal("show");
    });

    function queryModuleByRoleId(roleId, system) {

        role.system = system;

        var $wrap = com.focusPage('#moduleModal').find('.modal-body').empty();

        com.post(api.system.queryModuleForLogin, {
            'module.system': system
        }, function(data) {

            var menuArr = {
                level1: [],
                level2: [],
                level3: [],
            };

            var menuObj = {
                level1: {},
                level2: {},
            };
            var treeData = data.modules;

            var $tree = $('<ol class="dd-list"></ol>');
            var arr;
            $wrap.append($tree);

            if (!treeData || !treeData.length) {
                return;
            }

            $.each(treeData, function(i, v) {

                arr = menuArr['level' + v.level];
                arr[arr.length] = v;
            });

            $.each(menuArr, function(key, val) {

                menuArr[key] = val.sort(function(a, b) {

                    return a.mid - b.mid;
                });
            });

            if (menuArr.level1.length) {
                $.each(menuArr.level1, function(i, v) {

                    var $li = $('<li></li>').addClass('dd-item');
                    var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name + "-" + v.alias);

                    var $input = $('<input>').attr({
                        type: 'checkbox',
                        name: 'module'
                    }).addClass('ace').val(v.mid);
                    var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({
                        'margin-bottom': '0',
                        'margin-top': '-5px'
                    });
                    var $label = $('<label></label>').append($input).append('<span class="lbl">权限</span>');

                    $indexCheck.append($label).appendTo($div);

                    $li.append($div).appendTo($tree);
                    menuObj.level1[v.mid] = $li;
                });
            }

            if (menuArr.level2.length) {
                $.each(menuArr.level2, function(i, v) {

                    var $li = $('<li></li>').addClass('dd-item');
                    var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name + "-" + v.alias);

                    var $input = $('<input>').attr({
                        type: 'checkbox',
                        name: 'module'
                    }).addClass('ace').val(v.mid);
                    var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({
                        'margin-bottom': '0',
                        'margin-top': '-5px'
                    });
                    var $label = $('<label></label>').append($input).append('<span class="lbl">权限</span>');

                    $indexCheck.append($label).appendTo($div);

                    if (v.url && v.url != '') {
                        var $inputL = $('<input>').attr({
                            type: 'checkbox',
                            name: 'link'
                        }).addClass('ace').val(v.mid);

                        var $checkL = $('<div></div>').addClass('checkbox pull-right').css({
                            'margin-bottom': '0',
                            'margin-top': '-5px',
                            'margin-left': '5px'
                        });
                        var $labelL = $('<label></label>').append($inputL).append('<span class="lbl">快捷</span>');

                        $checkL.append($labelL).appendTo($div);

                        var $inputA = $('<input>').attr({
                            type: 'checkbox',
                            name: 'access'
                        }).addClass('ace').val(v.mid);

                        var $checkA = $('<div></div>').addClass('checkbox pull-right').css({
                            'margin-bottom': '0',
                            'margin-top': '-5px',
                            'margin-left': '5px'
                        });
                        var $labelA = $('<label></label>').append($inputA).append('<span class="lbl">访问</span>');

                        $checkA.append($labelA).appendTo($div);

                    }

                    menuObj.level2[v.mid] = $li;

                    $li.append($div);

                    var $parent = menuObj.level1[v.fatherModule.mid];
                    $parent.children('div').hasClass('btn-default') || $parent.children('div').addClass('btn-default');
                    if (!$parent.children('button').length) {
                        var $title = $parent.children('div');
                        $('<button type="button" data-action="collapse" class="minus">Collapse</button>').insertBefore($title);
                        $('<button type="button" data-action="expand" class="hide plus">Expand</button>').insertBefore($title);
                    }

                    var $pol = $parent.children('ol').length ? $parent.children('ol') : $('<ol></ol>').addClass('dd-list').appendTo($parent);
                    $li.appendTo($pol);
                });
            }

            if (menuArr.level3.length) {
                $.each(menuArr.level3, function(i, v) {

                    var $li = $('<li></li>').addClass('dd-item item-blue2');
                    var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name + "-" + v.alias);

                    var $input = $('<input>').attr({
                        type: 'checkbox',
                        name: 'module'
                    }).addClass('ace').val(v.mid);

                    var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({
                        'margin-bottom': '0',
                        'margin-top': '-5px'
                    });
                    var $label = $('<label></label>').append($input).append('<span class="lbl">权限</span>');

                    $indexCheck.append($label).appendTo($div);

                    if (v.url && v.url != '') {
                        var $inputL = $('<input>').attr({
                            type: 'checkbox',
                            name: 'link'
                        }).addClass('ace').val(v.mid);

                        var $checkL = $('<div></div>').addClass('checkbox pull-right').css({
                            'margin-bottom': '0',
                            'margin-top': '-5px',
                            'margin-left': '5px'
                        });
                        var $labelL = $('<label></label>').append($inputL).append('<span class="lbl">快捷</span>');

                        $checkL.append($labelL).appendTo($div);

                        var $inputA = $('<input>').attr({
                            type: 'checkbox',
                            name: 'access'
                        }).addClass('ace').val(v.mid);

                        var $checkA = $('<div></div>').addClass('checkbox pull-right').css({
                            'margin-bottom': '0',
                            'margin-top': '-5px',
                            'margin-left': '5px'
                        });
                        var $labelA = $('<label></label>').append($inputA).append('<span class="lbl">访问</span>');

                        $checkA.append($labelA).appendTo($div);

                    }

                    menuObj.level2[v.mid] = $li;

                    $li.append($div);

                    var $parent = menuObj.level2[v.fatherModule.mid];
                    if (!$parent.children('button').length) {
                        var $title = $parent.children('div');
                        $('<button type="button" data-action="collapse" class="minus">Collapse</button>').insertBefore($title);
                        $('<button type="button" data-action="expand" class="hide plus">Expand</button>').insertBefore($title);
                    }

                    var $pol = $parent.children('ol').length ? $parent.children('ol') : $('<ol></ol>').addClass('dd-list').appendTo($parent);
                    $li.appendTo($pol);
                });
            }

            $('button[data-action="collapse"]').click(function() {

                var $this = $(this);
                $this.siblings('ol').addClass('hide');
                $this.parent().find('.plus').toggleClass('hide');
                $this.toggleClass('hide');
            });

            $('button[data-action="expand"]').click(function() {

                var $this = $(this);
                $this.siblings('ol').removeClass('hide');
                $this.parent().find('.minus').toggleClass('hide');
                $this.toggleClass('hide');
            });

        }, null, false);

        // 获取角色的模块
        com.post(api.system.queryModuleByRid, {
            'module.system': system,
            "role.rid": roleId
        }, function(data) {

            $.each(data.modules, function(i, v) {

                $wrap.find('input[name="module"][value="' + v.mid + '"]').prop('checked', true);
                $wrap.find('input[name="link"][value="' + v.mid + '"]').prop('checked', v.link == 0);
                $wrap.find('input[name="access"][value="' + v.mid + '"]').prop('checked', v.access == 0);
            });
        });
    }

    function editRole(rid, no, name, content) {

        role.rid = rid;

        role.items.no.prop("disabled", true).css("display", "block").val(no);
        role.items.name.val(name);
        role.items.content.val(content);

        role.modals.roleModal.modal("show");
    }

    function deleteRole(roleId) {

        var options = {
            "role.rid": roleId,
        };

        com.post(api.system.deleteRoleByRid, options, function(res) {

            searcher.doSearch();
        });
    }

    function saveModule() {

        var idarrs = role.modals.moduleModal.find('input[name="module"]:checked');

        var params = {
            "module.system": role.system,
            "role.rid": role.rid,
        };

        if (idarrs.length) {
            idarrs.each(function(i) {

                var _mid = $(this).val();
                var _link = role.modals.moduleModal.find('input[name="link"][value="' + _mid + '"]').prop("checked");
                var _access = role.modals.moduleModal.find('input[name="access"][value="' + _mid + '"]').prop("checked");

                params['modules[' + i + '].mid'] = $(this).val();
                params['modules[' + i + '].link'] = _link ? 0 : 1;
                params['modules[' + i + '].access'] = _access ? 0 : 1;
            });
        }

        com.post(api.system.updateRoleModuleByRid, params, function() {

            role.rid = null;

            role.modals.moduleModal.modal('hide');
        });
    }

    function saveOperation() {

        var idarrs = $('input[name="operation"]:checked');

        var params = {
            "operation.system": 1,
            "role.rid": role.rid,
        }

        if (idarrs.length) {
            idarrs.each(function(i) {

                params['oids[' + i + ']'] = $(this).val();
            });
        }

        com.post(api.system.updateRoleOperationByRid, params, function() {

            role.rid = null;

            role.modals.operationModal.modal('hide');
        });
    }

    function saveTask() {

        var $inputs = com.focusPage('input[name="corporabtask"]:checked');

        var params = {
            "role.rid": role.rid
        };

        $.each($inputs, function(i, v) {

            var $input = $(v);
            var row = {
                "tid": $input.attr('id')
            };

            params["tids[" + i + "]"] = row.tid;
        });

        com.post(api.communion.updateRoleTask, params, function(res) {

            role.rid = null;

            role.modals.taskModal.modal("hide");
        });
    }

    function addRoleTask() {

        if (com.validate("taskModal")) {
            return false;
        }

        console.log(com.typeahead(role.items.task))

        com.post(api.communion.updateRoleTask, {
            "role.rid": role.rid,
            'task.tid': com.typeahead(role.items.task)
        });
    }

    function saveData() {

        if (com.validate("roleModal")) {
            return false;
        }

        var url = api.system.addRole;
        var options = {
            'role.name': role.items.name.val(),
            'role.content': role.items.content.val(),
            'role.no': role.items.no.val()
        };

        if (role.rid) {
            url = api.system.updateRole;
            options["role.rid"] = role.rid;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        role.modals.roleModal.modal("hide");
    }

    function gotoRoleRight(roleId, roleName) {

        com.focusPage("#roleList").addClass("hidden");
        com.focusPage("#roleRightDiv").removeClass("hidden");
        com.focusPage("#roleRightRoleId").val(roleId);
        com.focusPage("#roleRightContent").html("配置角色(" + roleName + ")权限");

        com.post(api.system.queryRoleRight, {
            "role.rid": roleId
        }, function(res) {

            $.fn.zTree.init(com.focusPage("#treeDemo"), setting, res.zTree);
        });
    }

    function goBackRoleList() {

        com.focusPage("#roleRightDiv").addClass("hidden");
        com.focusPage("#roleList").removeClass("hidden");
        com.focusPage("#roleRightRoleId").val("");
        com.focusPage("#roleRightContent").html("配置角色()权限");
    }

    function saveRoleRight() {

        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        zTreeNodes = treeObj.getNodes();

        var rightTree = [];
        var params = {};

        for ( var i = 0; i < zTreeNodes.length; ++i) {
            var module = {};
            params["rightTree[" + i + "].id"] = zTreeNodes[i].id;
            params["rightTree[" + i + "].name"] = zTreeNodes[i].name;
            params["rightTree[" + i + "].checked"] = zTreeNodes[i].checked;
            params["rightTree[" + i + "].open"] = zTreeNodes[i].open;
            params["rightTree[" + i + "].nocheck"] = zTreeNodes[i].nocheck;
            params["rightTree[" + i + "].chkDisabled"] = zTreeNodes[i].chkDisabled;

            for ( var j = 0; j < zTreeNodes[i].children.length; ++j) {
                var func = {};
                params["rightTree[" + i + "].children[" + j + "].id"] = zTreeNodes[i].children[j].id;
                params["rightTree[" + i + "].children[" + j + "].name"] = zTreeNodes[i].children[j].name;
                params["rightTree[" + i + "].children[" + j + "].checked"] = zTreeNodes[i].children[j].checked;
                params["rightTree[" + i + "].children[" + j + "].open"] = zTreeNodes[i].children[j].open;
                params["rightTree[" + i + "].children[" + j + "].nocheck"] = zTreeNodes[i].children[j].nocheck;
                params["rightTree[" + i + "].children[" + j + "].chkDisabled"] = zTreeNodes[i].children[j].chkDisabled;

                for ( var k = 0; k < zTreeNodes[i].children[j].children.length; ++k) {
                    params["rightTree[" + i + "].children[" + j + "].children[" + k + "].id"] = zTreeNodes[i].children[j].children[k].id;
                    params["rightTree[" + i + "].children[" + j + "].children[" + k + "].name"] = zTreeNodes[i].children[j].children[k].name;
                    params["rightTree[" + i + "].children[" + j + "].children[" + k + "].checked"] = zTreeNodes[i].children[j].children[k].checked;
                    params["rightTree[" + i + "].children[" + j + "].children[" + k + "].open"] = zTreeNodes[i].children[j].children[k].open;
                    params["rightTree[" + i + "].children[" + j + "].children[" + k + "].nocheck"] = zTreeNodes[i].children[j].children[k].nocheck;
                    params["rightTree[" + i + "].children[" + j + "].children[" + k + "].chkDisabled"] = zTreeNodes[i].children[j].children[k].chkDisabled;

                    for ( var m = 0; m < zTreeNodes[i].children[j].children[k].children.length; ++m) {
                        params["rightTree[" + i + "].children[" + j + "].children[" + k + "].children[" + m + "].id"] = zTreeNodes[i].children[j].children[k].children[m].id;
                        params["rightTree[" + i + "].children[" + j + "].children[" + k + "].children[" + m + "].name"] = zTreeNodes[i].children[j].children[k].children[m].name;
                        params["rightTree[" + i + "].children[" + j + "].children[" + k + "].children[" + m + "].checked"] = zTreeNodes[i].children[j].children[k].children[m].checked;
                        params["rightTree[" + i + "].children[" + j + "].children[" + k + "].children[" + m + "].open"] = zTreeNodes[i].children[j].children[k].children[m].open;
                        params["rightTree[" + i + "].children[" + j + "].children[" + k + "].children[" + m + "].nocheck"] = zTreeNodes[i].children[j].children[k].children[m].nocheck;
                        params["rightTree[" + i + "].children[" + j + "].children[" + k + "].children[" + m + "].chkDisabled"] = zTreeNodes[i].children[j].children[k].children[m].chkDisabled;
                    }
                }
            }
        }
        params["role.no"] = com.focusPage("#roleRightRoleId").val();

        com.post(api.system.updateRoleRight, params, function(res) {

            com.showAlert(com.info, "操作成功");
            goBackRoleList();
        });
    }

    function saveChainPage() {

        var options = {
            "roleChainPage.rid": role.rid
        }

        var cpitems = role.items.chainList.find('input[type="checkbox"]:checked');

        if (cpitems.length == 0) {
            options["cpids"] = [];
        } else {
            $.each(cpitems, function(i, e) {

                options["cpids" + "[" + i + "]"] = $(e).attr("cpid");
            });
        }

        com.post(api.right.updateRoleChainPage, options, function(res) {

            role.modals.chainPageModal.modal("hide");
        });
    }

    function saveChartPage() {

        var options = {
            "role.rid": role.rid
        };

        var citems = role.items.chartList.find('input[type="checkbox"]:checked');

        if (citems.length == 0) {
            options["cids"] = [];
        } else {
            $.each(citems, function(i, e) {

                options["cids" + "[" + i + "]"] = $(e).attr("cid");
            });
        }

        com.post(api.data.updateRoleChartByRid, options, function(res) {

            com.showAlert(com.info, "操作成功");
            role.modals.chartPageModal.modal("hide");
        });
    }

    // 新增模块配置(新)相关函数
    function queryModuleNewByRoleId(roleId) {
        console.log('queryModuleNewByRoleId called with roleId:', roleId);

        // 先显示弹窗，再加载数据
        com.focusPage('#moduleNewModal').modal('show');

        // 显示加载中状态
        com.focusPage('#moduleNewTree').html('<div class="text-center" style="padding: 50px;"><i class="ace-icon fa fa-spinner fa-spin fa-2x"></i><p>正在加载模块数据...</p></div>');

        // 获取一级模块数据
        com.post(api.system.queryModule, {
            'module.system': 1,
            'module.level': 1
        }, function(data) {
            console.log('API response:', data);
            if (data.modules && data.modules.length > 0) {
                renderModuleNewTree(data.modules, roleId);
            } else {
                com.focusPage('#moduleNewTree').html('<div class="text-center" style="padding: 50px; color: #999;">暂无模块数据</div>');
            }
        }, function(error) {
            console.error('API call failed:', error);
            com.focusPage('#moduleNewTree').html('<div class="text-center" style="padding: 50px; color: red;">加载失败，请重试</div>');
        });
    }

    // ==================== 功能化公共方法 ====================

    // ===== DOM操作工具类 =====

    /**
     * DOM操作工具类
     */
    var DOMUtils = {
        /**
         * 创建元素并设置属性
         * @param {String} tagName - 标签名
         * @param {Object} attributes - 属性对象
         * @param {String} text - 文本内容
         * @return {jQuery} jQuery元素
         */
        createElement: function(tagName, attributes, text) {
            var $element = $('<' + tagName + '>');
            if (attributes) {
                // 分别处理 class 和 css 属性
                if (attributes.class) {
                    $element.addClass(attributes.class);
                    delete attributes.class;
                }
                if (attributes.css) {
                    $element.css(attributes.css);
                    delete attributes.css;
                }
                // 设置其他属性
                $element.attr(attributes);
            }
            if (text) {
                $element.text(text);
            }
            return $element;
        },

        /**
         * 快速查找模块元素
         * @param {Number} mid - 模块ID
         * @return {jQuery} 模块元素
         */
        findModule: function(mid) {
            return com.focusPage('.dd-item[data-mid="' + mid + '"]');
        },

        /**
         * 查找权限复选框
         * @param {Number} mid - 模块ID
         * @param {String} type - 权限类型 (permission/link/access)
         * @return {jQuery} 复选框元素
         */
        findPermissionCheckbox: function(mid, type) {
            return com.focusPage('.module-' + type + '[value="' + mid + '"]');
        },

        /**
         * 获取模块的父子关系
         * @param {Number} mid - 模块ID
         * @param {String} relation - 关系类型 (parent/children)
         * @return {jQuery} 相关模块元素
         */
        getModuleRelation: function(mid, relation) {
            var $module = this.findModule(mid);
            if (relation === 'parent') {
                return $module.closest('.dd-list').closest('.dd-item');
            } else if (relation === 'children') {
                return $module.find('> .dd-list > .dd-item');
            }
            return $();
        }
    };

    // ===== 模块配置工具类 =====

    /**
     * 模块配置工具类
     */
    var ModuleConfigUtils = {
        /**
         * 获取层级样式类
         * @param {Number} level - 层级
         * @return {String} 样式类名
         */
        getLevelClass: function(level) {
            var levelClasses = {
                1: '',
                2: 'item-blue2',
                3: 'item-green'
            };
            return levelClasses[level] || '';
        },

        /**
         * 获取层级缩进距离
         * @param {Number} level - 层级
         * @return {Number} 缩进像素值
         */
        getLevelIndent: function(level) {
            return (level - 1) * 10;
        },

        /**
         * 判断模块是否可以展开
         * @param {Object} module - 模块数据
         * @return {Boolean} 是否可展开
         */
        canExpand: function(module) {
            return !module.url || module.url === '';
        },

        /**
         * 获取权限图标状态
         * @param {String} status - 状态 (plus/minus/spinner)
         * @return {String} 图标类名
         */
        getExpandIconClass: function(status) {
            var iconClasses = {
                'plus': 'fa-plus',
                'minus': 'fa-minus',
                'spinner': 'fa-spinner fa-spin'
            };
            return iconClasses[status] || 'fa-plus';
        }
    };

    // ===== 权限管理工具类 =====

    /**
     * 权限管理工具类
     */
    var PermissionUtils = {
        /**
         * 权限类型配置
         */
        PERMISSION_TYPES: {
            PERMISSION: {
                name: 'permission',
                label: '权限',
                class: 'module-permission'
            },
            LINK: {
                name: 'link',
                label: '快捷',
                class: 'module-link'
            },
            ACCESS: {
                name: 'access',
                label: '访问',
                class: 'module-access'
            }
        },

        /**
         * 创建权限复选框
         * @param {Number} mid - 模块ID
         * @param {Object} typeConfig - 权限类型配置
         * @return {jQuery} 复选框元素
         */
        createCheckbox: function(mid, typeConfig) {
            return DOMUtils.createElement('input', {
                type: 'checkbox',
                name: 'moduleNew',
                value: mid
            }).addClass('ace ' + typeConfig.class);
        },

        /**
         * 创建权限复选框容器
         * @param {jQuery} checkbox - 复选框元素
         * @param {String} label - 标签文本
         * @return {jQuery} 容器元素
         */
        createCheckboxContainer: function(checkbox, label) {
            var $label = DOMUtils.createElement('label').append(checkbox).append('<span class="lbl">' + label + '</span>');
            return DOMUtils.createElement('div', {
                'class': 'checkbox pull-right',
                'css': {
                    'margin-bottom': '0',
                    'margin-top': '-5px'
                }
            }).append($label);
        },

        /**
         * 判断模块是否有特定权限
         * @param {Object} module - 模块数据
         * @param {String} permissionType - 权限类型
         * @return {Boolean} 是否有权限
         */
        hasPermission: function(module, permissionType) {
            // 快捷方式和访问权限需要有URL的模块
            if (permissionType !== 'PERMISSION') {
                return module.url && module.url !== '';
            }
            return true; // 权限复选框所有模块都有
        },

        /**
         * 批量设置权限状态
         * @param {Array} permissions - 权限数据
         */
        batchSetPermissions: function(permissions) {
            permissions.forEach(function(permission) {
                var mid = permission.mid;

                // 设置权限
                DOMUtils.findPermissionCheckbox(mid, 'permission').prop('checked', true);

                // 设置快捷方式
                if (permission.link === 0) {
                    DOMUtils.findPermissionCheckbox(mid, 'link').prop('checked', true);
                }

                // 设置访问权限
                if (permission.access === 0) {
                    DOMUtils.findPermissionCheckbox(mid, 'access').prop('checked', true);
                }
            });
        }
    };

    // ===== 级联操作工具类 =====

    /**
     * 级联操作工具类
     */
    var CascadeUtils = {
        /**
         * 执行向上级联操作
         * @param {Number} startMid - 起始模块ID
         * @param {String} operation - 操作类型 (check/uncheck)
         */
        executeUpCascade: function(startMid, operation) {
            var currentMid = startMid;
            var currentLevel = 1;

            // 获取起始模块的层级
            var $startModule = DOMUtils.findModule(startMid);
            if ($startModule.length > 0) {
                currentLevel = parseInt($startModule.attr('data-level') || '1');
            }

            this.cascadeUpRecursive(currentMid, currentLevel, operation);
        },

        /**
         * 递归向上级联
         * @param {Number} mid - 当前模块ID
         * @param {Number} level - 当前层级
         * @param {String} operation - 操作类型
         */
        cascadeUpRecursive: function(mid, level, operation) {
            if (level <= 1) return;

            var $parent = DOMUtils.getModuleRelation(mid, 'parent');
            if ($parent.length > 0) {
                var parentMid = parseInt($parent.attr('data-mid'));
                var $parentCheckbox = DOMUtils.findPermissionCheckbox(parentMid, 'permission');

                if (operation === 'check' && !$parentCheckbox.prop('checked')) {
                    $parentCheckbox.prop('checked', true);
                }

                // 继续向上级联
                this.cascadeUpRecursive(parentMid, level - 1, operation);
            }
        },

        /**
         * 执行向下级联操作
         * @param {Number} parentMid - 父模块ID
         * @param {String} operation - 操作类型
         */
        executeDownCascade: function(parentMid, operation) {
            var $children = DOMUtils.getModuleRelation(parentMid, 'children');

            $children.each(function() {
                var $child = $(this);
                var childMid = parseInt($child.attr('data-mid'));
                var $childCheckbox = DOMUtils.findPermissionCheckbox(childMid, 'permission');

                if (operation === 'uncheck' && $childCheckbox.prop('checked')) {
                    $childCheckbox.prop('checked', false);
                }

                // 递归向下级联
                CascadeUtils.executeDownCascade(childMid, operation);
            });
        }
    };

    // ==================== 重构后的公共工具方法 ====================

    /**
     * 创建模块项的通用方法
     * @param {Object} module - 模块数据
     * @param {Number} level - 模块层级 (1,2,3)
     * @param {Function} onExpand - 展开回调函数
     * @return {jQuery} 模块项DOM元素
     */
    function createModuleItem(module, level, onExpand) {
        // 创建基础模块元素
        var $li = DOMUtils.createElement('li', {
            'class': 'dd-item ' + ModuleConfigUtils.getLevelClass(level),
            'data-mid': module.mid,
            'data-level': level
        });

        // 创建模块内容容器
        var $div = DOMUtils.createElement('div', {'class': 'dd-handle clearfix'});

        // 添加展开按钮
        if (ModuleConfigUtils.canExpand(module)) {
            var $expandBtn = createExpandButton(module, $li, onExpand);
            $div.append($expandBtn);
        }

        // 添加模块名称
        var $nameSpan = DOMUtils.createElement('span', {
            'style': 'margin-left: ' + ModuleConfigUtils.getLevelIndent(level) + 'px;'
        }, module.name + '-' + module.alias);
        $div.append($nameSpan);

        // 添加权限复选框
        addPermissionCheckboxes($div, module);

        $li.append($div);

        // 添加子模块容器
        if (ModuleConfigUtils.canExpand(module)) {
            $li.append(DOMUtils.createElement('ol', {'class': 'dd-list hide'}));
        }

        return $li;
    }

    /**
     * 创建展开按钮
     * @param {Object} module - 模块数据
     * @param {jQuery} $li - 模块LI元素
     * @param {Function} onExpand - 展开回调
     * @return {jQuery} 展开按钮元素
     */
    function createExpandButton(module, $li, onExpand) {
        var $expandBtn = DOMUtils.createElement('button', {
            'type': 'button',
            'class': 'btn btn-xs btn-info pull-left',
            'style': 'margin-right: 5px;'
        }).append('<i class="ace-icon fa fa-plus"></i>');

        $expandBtn.on('click', function(e) {
            e.stopPropagation();
            if (onExpand) {
                onExpand(module, $li, $expandBtn);
            }
        });

        return $expandBtn;
    }

    /**
     * 添加权限复选框
     * @param {jQuery} $container - 容器元素
     * @param {Object} module - 模块数据
     */
    function addPermissionCheckboxes($container, module) {
        // 创建权限复选框
        var $permissionCheckbox = PermissionUtils.createCheckbox(module.mid, PermissionUtils.PERMISSION_TYPES.PERMISSION);
        var $permissionContainer = PermissionUtils.createCheckboxContainer($permissionCheckbox, '权限');
        $container.append($permissionContainer);

        // 添加权限复选框事件（级联+实时更新）
        $permissionCheckbox.on('change', function() {
            var isChecked = $(this).prop('checked');

            // 执行级联操作
            handlePermissionCascade(module.mid, isChecked);

            // 实时更新权限到服务器
            updateModulePermissionRealtime(module.mid);
        });

        // 添加快捷方式和访问权限（如果有URL）
        if (PermissionUtils.hasPermission(module, 'LINK')) {
            var $linkCheckbox = PermissionUtils.createCheckbox(module.mid, PermissionUtils.PERMISSION_TYPES.LINK);
            var $linkContainer = PermissionUtils.createCheckboxContainer($linkCheckbox, '快捷');
            $linkContainer.find('div.checkbox').css('margin-left', '5px');
            $container.append($linkContainer);

            // 快捷方式复选框事件（实时更新）
            $linkCheckbox.on('change', function() {
                updateModulePermissionRealtime(module.mid);
            });
        }

        if (PermissionUtils.hasPermission(module, 'ACCESS')) {
            var $accessCheckbox = PermissionUtils.createCheckbox(module.mid, PermissionUtils.PERMISSION_TYPES.ACCESS);
            var $accessContainer = PermissionUtils.createCheckboxContainer($accessCheckbox, '访问');
            $accessContainer.find('div.checkbox').css('margin-left', '5px');
            $container.append($accessContainer);

            // 访问权限复选框事件（实时更新）
            $accessCheckbox.on('change', function() {
                updateModulePermissionRealtime(module.mid);
            });
        }
    }

    /**
     * 通用的模块展开/收起处理
     * @param {Object} parentModule - 父模块数据
     * @param {jQuery} $parentLi - 父模块LI元素
     * @param {jQuery} $expandBtn - 展开按钮
     * @param {Number} childLevel - 子模块层级
     */
    function toggleModuleChildren(parentModule, $parentLi, $expandBtn, childLevel) {
        var $childContainer = $parentLi.find('> .dd-list');
        var $icon = $expandBtn.find('i');
        var isExpanded = $icon.hasClass('fa-minus');

        if (isExpanded) {
            // 收起
            $childContainer.addClass('hide');
            $icon.removeClass('fa-minus').addClass('fa-plus');
        } else {
            // 展开
            if ($childContainer.children().length === 0) {
                // 首次展开，需要加载子模块
                $icon.removeClass('fa-plus').addClass('fa-spinner fa-spin');

                // 并行加载模块数据和权限数据
                var moduleDataLoaded = false;
                var permissionDataLoaded = false;

                function checkAndRender() {
                    if (moduleDataLoaded && permissionDataLoaded) {
                        $icon.removeClass('fa-spinner fa-spin');
                        // 显示容器
                        $icon.removeClass('fa-plus').addClass('fa-minus');
                        $childContainer.removeClass('hide');
                    }
                }

                // 1. 加载子模块数据
                loadChildModules(parentModule.mid, childLevel, function(moduleData) {
                    if (moduleData.modules && moduleData.modules.length > 0) {
                        // 按order排序
                        var sortedModules = moduleData.modules.sort(function(a, b) {
                            return (a.order || 0) - (b.order || 0);
                        });

                        // 创建子模块
                        sortedModules.forEach(function(childModule) {
                            if(childModule.level !== childLevel) return true;
                            var $childLi = createModuleItem(childModule, childLevel, function(module, li, btn) {
                                toggleModuleChildren(module, li, btn, childLevel + 1);
                            });
                            $childContainer.append($childLi);
                        });

                        moduleDataLoaded = true;
                        checkAndRender();

                        // 2. 同时加载该层级的权限数据
                        loadChildModulePermissions(childLevel, parentModule.mid, function(permissionData) {
                            // 使用DOM标识快速定位并设置权限状态
                            applyModulePermissions(permissionData.modules || []);
                            permissionDataLoaded = true;
                            checkAndRender();
                        });
                    } else {
                        // 没有子模块，移除展开按钮
                        $expandBtn.remove();
                    }
                }, function() {
                    // 加载失败，恢复按钮状态
                    $icon.removeClass('fa-spinner fa-spin').addClass('fa-plus');
                });
            } else {
                // 已经加载过，直接展开
                $icon.removeClass('fa-plus').addClass('fa-minus');
                $childContainer.removeClass('hide');
            }
        }
    }

    /**
     * 加载子模块数据
     * @param {Number} parentMid - 父模块ID
     * @param {Number} level - 模块层级
     * @param {Function} successCallback - 成功回调
     * @param {Function} errorCallback - 失败回调
     */
    function loadChildModules(parentMid, level, successCallback, errorCallback) {
        com.post(api.system.queryModuleForLogin, {
            'module.system': 1,
            'module.level': level,
            'module.fatherModule.mid': parentMid
        }, successCallback, errorCallback);
    }

    /**
     * 加载指定层级的模块权限数据
     * @param {Number} level - 模块层级
     * @param {Number} fatherMid - 父模块ID
     * @param {Function} callback - 回调函数
     */
    function loadChildModulePermissions(level, fatherMid, callback) {
        // 调用权限API，获取该层级的权限数据
        com.post(api.system.queryModuleByRid, {
            'module.system': 1,
            'module.level': level,
            'module.fatherModule.mid': fatherMid,
            'role.rid': role.rid
        }, callback, null, false);
    }

    /**
     * 应用模块权限到DOM元素
     * @param {Array} permissions - 权限数据数组
     */
    function applyModulePermissions(permissions) {
        PermissionUtils.batchSetPermissions(permissions);
    }

    /**
     * 实时更新模块权限到服务器
     * @param {Number} moduleMid - 模块ID
     */
    function updateModulePermissionRealtime(moduleMid) {
        // 防抖处理，避免频繁调用
        if (window.updateModulePermissionTimeout) {
            clearTimeout(window.updateModulePermissionTimeout);
        }

        window.updateModulePermissionTimeout = setTimeout(function() {
            // 收集当前所有选中的模块权限
            var selectedModules = [];
            com.focusPage('#moduleNewTree').find('input[name="moduleNew"]:checked').each(function() {
                var mid = $(this).val();
                var moduleData = {
                    'mid': mid,
                    'link': 1, // 默认为1(无权限)
                    'access': 1 // 默认为1(无权限)
                };

                // 检查快捷方式权限
                var $linkCheckbox = DOMUtils.findPermissionCheckbox(mid, 'link');
                if ($linkCheckbox.length > 0 && $linkCheckbox.prop('checked')) {
                    moduleData.link = 0; // 0表示有权限
                }

                // 检查访问权限
                var $accessCheckbox = DOMUtils.findPermissionCheckbox(mid, 'access');
                if ($accessCheckbox.length > 0 && $accessCheckbox.prop('checked')) {
                    moduleData.access = 0; // 0表示有权限
                }

                selectedModules.push(moduleData);
            });

            // 构建提交参数
            var params = {
                'module.system': 1,
                'role.rid': role.rid
            };

            selectedModules.forEach(function(module, index) {
                params['modules[' + index + '].mid'] = module.mid;
                params['modules[' + index + '].link'] = module.link;
                params['modules[' + index + '].access'] = module.access;
            });

            // 实时提交到服务器
            com.post(api.system.updateRoleModule, params, function() {
                console.log('模块权限更新成功，模块ID:', moduleMid);
                // 可以在这里添加成功的用户提示
                // com.showAlert(com.info, '权限已自动保存');
            }, function(error) {
                console.error('模块权限更新失败:', error);
                com.showAlert(com.error, '权限更新失败，请重试');
            });

        }, 300); // 300ms防抖延迟
    }

    /**
     * 处理权限级联勾选
     * @param {Number} moduleMid - 当前模块ID
     * @param {Boolean} isChecked - 是否勾选
     */
    function handlePermissionCascade(moduleMid, isChecked) {
        if (isChecked) {
            // 勾选：向上级联勾选父模块
            CascadeUtils.executeUpCascade(moduleMid, 'check');
        } else {
            // 取消勾选：向下级联取消子模块
            CascadeUtils.executeDownCascade(moduleMid, 'uncheck');
        }
    }

    /**
     * 为指定层级的模块加载权限数据（兼容旧方法）
     * @param {Number} level - 模块层级
     */
    function loadModulePermissionsForLevel(level) {
        // 兼容旧的调用方式
        if (level === 1) {
            // 一级模块权限在初始化时已经加载
            return;
        }
    }

    // ==================== 业务逻辑方法 ====================

    function renderModuleNewTree(modules, roleId) {
        var $wrap = com.focusPage('#moduleNewTree').empty();

        // 创建与原版模块配置相同的树形结构
        var $tree = $('<ol class="dd-list"></ol>');
        $wrap.append($tree);

        if (!modules || !modules.length) {
            $wrap.html('<div class="text-center" style="padding: 50px; color: #999;">暂无模块数据</div>');
            return;
        }

        // 按mid排序
        modules.sort(function(a, b) {
            return a.mid - b.mid;
        });

        // 创建一级模块项
        $.each(modules, function(i, module) {
            var $li = createModuleNewItem(module);
            $li.appendTo($tree);
        });

        // 延迟加载角色已有权限，确保DOM完全渲染
        setTimeout(function() {
            loadRoleModulePermissions(roleId);
        }, 100);
    }

    function createModuleNewItem(module) {
        return createModuleItem(module, 1, function(module, li, btn) {
            toggleModuleChildren(module, li, btn, 2);
        });
    }

    function createChildModuleItem(module) {
        return createModuleItem(module, 2, function(module, li, btn) {
            toggleModuleChildren(module, li, btn, 3);
        });
    }

    function createThirdLevelModuleItem(module) {
        return createModuleItem(module, 3, null); // 三级模块不再有子模块
    }

    function loadRoleModulePermissions(roleId) {
        // 获取角色已有的模块权限
        com.post(api.system.queryModuleByRid, {
            'module.system': 1,
            'role.rid': roleId,
            'module.level': 1,
        }, function(data) {
            console.log('loadRoleModulePermissions response:', data);
            if (data.modules && data.modules.length > 0) {
                data.modules.forEach(function(perm) {
                    console.log('Processing permission for mid:', perm.mid, 'link:', perm.link, 'access:', perm.access);

                    // 设置权限复选框 - 使用value属性查找
                    var $permCheckbox = com.focusPage('.module-permission[value="' + perm.mid + '"]');
                    if ($permCheckbox.length > 0) {
                        $permCheckbox.prop('checked', true);
                        console.log('Set permission checkbox for mid:', perm.mid);
                    } else {
                        console.warn('Permission checkbox not found for mid:', perm.mid);
                    }

                    // 设置快捷方式权限 - 使用value属性查找
                    if (perm.link === 0) {
                        var $linkCheckbox = com.focusPage('.module-link[value="' + perm.mid + '"]');
                        if ($linkCheckbox.length > 0) {
                            $linkCheckbox.prop('checked', true);
                            console.log('Set link checkbox for mid:', perm.mid);
                        } else {
                            console.warn('Link checkbox not found for mid:', perm.mid);
                        }
                    }

                    // 设置访问权限 - 使用value属性查找
                    if (perm.access === 0) {
                        var $accessCheckbox = com.focusPage('.module-access[value="' + perm.mid + '"]');
                        if ($accessCheckbox.length > 0) {
                            $accessCheckbox.prop('checked', true);
                            console.log('Set access checkbox for mid:', perm.mid);
                        } else {
                            console.warn('Access checkbox not found for mid:', perm.mid);
                        }
                    }
                });
            } else {
                console.log('No module permissions found for roleId:', roleId);
            }
        }, null, false);
    }

    function saveModuleNew() {
        // 现在权限已经实时更新，直接关闭弹窗并提示成功
        com.showAlert(com.info, '模块权限配置已自动保存');
        role.modals.moduleNewModal.modal('hide');

        // 清除防抖定时器，确保最后一次更新完成
        if (window.updateModulePermissionTimeout) {
            clearTimeout(window.updateModulePermissionTimeout);
            window.updateModulePermissionTimeout = null;
        }
    }

    /**
     * 显示公司选择弹窗
     * @param {Number} roleId - 角色ID
     * @param {String} roleName - 角色名称
     */
    function showCompanySelectionModal(roleId, roleName) {
        // 设置源角色信息
        com.focusPage('#sourceRoleName').text(roleName);
        com.focusPage('#copyRoleName').text('从角色【' + roleName + '】复制模块到其他公司');
        
        var companyList = com.focusPage('#companyList');

        // 清空公司列表
        companyList.html('<div class="text-center"><i class="ace-icon fa fa-spinner fa-spin fa-2x"></i><p>正在加载公司列表...</p></div>');

        // 加载公司列表
        com.post(api.system.queryCompany, {}, function(data) {
            
            if (!data.companys || data.companys.length == 0) {
                companyList.html('<div class="text-center text-muted">暂无可选公司</div>');
                return false;
            }
                
            companyList.html("");
            
            data.companys.forEach(function(company) {
                var item = $('<div class="company-item"></div>').appendTo(companyList);
                var label = $('<label class="checkbox-inline"></label>').appendTo(item);
                var input = $('<input type="checkbox" class="ace company-checkbox" value="' + company.cid + '"></input>').appendTo(label);
                var span = $('<span class="lbl">' + company.name + '</span>').appendTo(label);
                
                label.click(function(e){
                    
                    $(this).find("input").prop("checked", "checked");
                    
                    e.stopPropagation();
                    
                    return false;
                });
            });
        }, function() {
            companyList.html('<div class="text-center text-danger">加载公司列表失败</div>');
        });
    }

    /**
     * 确认模块复制操作
     */
    function confirmCopyModule() {
        var selectedCompanies = [];
        com.focusPage('.company-checkbox:checked').each(function() {
            selectedCompanies.push($(this).val());
        });

        if (selectedCompanies.length === 0) {
            com.showAlert(com.warning, '请至少选择一个目标公司');
            return;
        }

        // 禁用按钮，防止重复提交
        var $confirmBtn = com.focusPage('#confirmCopyBtn');
        $confirmBtn.prop('disabled', true).html('<i class="ace-icon fa fa-spinner fa-spin fa-1x"></i> 正在复制...');

        // 构建请求参数
        var params = {
            'role.rid': role.rid,
            'companys[0].cid': selectedCompanies[0]
        };

        // 如果选择了多个公司，添加其他公司参数
        for (var i = 1; i < selectedCompanies.length; i++) {
            params['companys[' + i + '].cid'] = selectedCompanies[i];
        }

        // 调用同步接口
        com.post(api.system.syncRoleModule, params, function(data) {
            if (data.errorCode == 0) {
                com.showAlert(com.info, '模块复制成功！');
                role.modals.companyCopyModal.modal('hide');

                // 刷新角色列表
                setTimeout(function() {
                    if (typeof searcher !== 'undefined') {
                        searcher.doSearch();
                    }
                }, 500);
            } else {
                com.showAlert(com.error, data.errorMsg || '模块复制失败');
            }
        }, function(error) {
            console.error('模块复制失败:', error);
            com.showAlert(com.error, '模块复制失败，请重试');
            // 确保在失败时也恢复按钮状态
            $confirmBtn.prop('disabled', false).html('确认复制');
        }, function() {
            // 恢复按钮状态 - complete回调在成功或失败后都会执行
            $confirmBtn.prop('disabled', false).html('确认复制');
        });
    }

    // 绑定模块复制弹窗的关闭事件，清理滚动事件监听器
    com.focusPage('#companyCopyModal').on('hidden.bs.modal', function() {
        // 清理滚动事件监听器，避免内存泄漏
        com.focusPage('#companyList').off('wheel mousewheel DOMMouseScroll');
    });

    /**
     * 显示任务复制弹窗
     */
    function showTaskCopySelectionModal() {
        // 获取当前角色名称
        var roleName = '';
        com.post(api.system.queryRole, {
            "role.rid": role.rid
        }, function(res) {
            if (res.role) {
                roleName = res.role.name;
                com.focusPage('#sourceTaskRoleName').text(roleName);
                com.focusPage('#copyTaskRoleName').text('从角色【' + roleName + '】复制任务到其他公司');
            }

            var taskCompanyList = com.focusPage('#taskCompanyList');

            // 清空公司列表
            taskCompanyList.html('<div class="text-center"><i class="ace-icon fa fa-spinner fa-spin fa-2x"></i><p>正在加载公司列表...</p></div>');

            // 加载公司列表
            com.post(api.system.queryCompany, {}, function(data) {

                if (!data.companys || data.companys.length == 0) {
                    taskCompanyList.html('<div class="text-center text-muted">暂无可选公司</div>');
                    return false;
                }

                taskCompanyList.html("");

                data.companys.forEach(function(company) {
                    var item = $('<div class="company-item"></div>').appendTo(taskCompanyList);
                    var label = $('<label class="checkbox-inline"></label>').appendTo(item);
                    var input = $('<input type="checkbox" class="ace task-company-checkbox" value="' + company.cid + '"></input>').appendTo(label);
                    var span = $('<span class="lbl">' + company.name + '</span>').appendTo(label);

                    label.click(function(e){

                        $(this).find("input").prop("checked", "checked");

                        e.stopPropagation();

                        return false;
                    });
                });
            }, function() {
                taskCompanyList.html('<div class="text-center text-danger">加载公司列表失败</div>');
            });

            // 显示弹窗
            role.modals.taskCopyModal.modal('show');
        });
    }

    /**
     * 确认任务复制操作
     */
    function confirmCopyTask() {
        var selectedCompanies = [];
        com.focusPage('.task-company-checkbox:checked').each(function() {
            selectedCompanies.push($(this).val());
        });

        if (selectedCompanies.length === 0) {
            com.showAlert(com.warning, '请至少选择一个目标公司');
            return;
        }

        // 禁用按钮，防止重复提交
        var $confirmBtn = com.focusPage('#confirmTaskCopyBtn');
        $confirmBtn.prop('disabled', true).html('<i class="ace-icon fa fa-spinner fa-spin fa-1x"></i> 正在复制...');

        // 构建请求参数
        var params = {
            'role.rid': role.rid,
            'companys[0].cid': selectedCompanies[0]
        };

        // 如果选择了多个公司，添加其他公司参数
        for (var i = 1; i < selectedCompanies.length; i++) {
            params['companys[' + i + '].cid'] = selectedCompanies[i];
        }

        // 调用同步接口
        com.post(api.communion.syncRoleTask, params, function(data) {
            if (data.errorCode == 0) {
                com.showAlert(com.info, '任务复制成功！');
                role.modals.taskCopyModal.modal('hide');

                // 刷新角色列表
                setTimeout(function() {
                    if (typeof searcher !== 'undefined') {
                        searcher.doSearch();
                    }
                }, 500);
            } else {
                com.showAlert(com.error, data.errorMsg || '任务复制失败');
            }
        }, function(error) {
            console.error('任务复制失败:', error);
            com.showAlert(com.error, '任务复制失败，请重试');
            // 确保在失败时也恢复按钮状态
            $confirmBtn.prop('disabled', false).html('确认复制');
        }, function() {
            // 恢复按钮状态 - complete回调在成功或失败后都会执行
            $confirmBtn.prop('disabled', false).html('确认复制');
        });
    }

    // 绑定任务复制弹窗的关闭事件，清理滚动事件监听器
    com.focusPage('#taskCopyModal').on('hidden.bs.modal', function() {
        // 清理滚动事件监听器，避免内存泄漏
        com.focusPage('#taskCompanyList').off('wheel mousewheel DOMMouseScroll');
    });

});
