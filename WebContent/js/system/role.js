jQuery(function($) {

    var role = {

        items: {

            no: com.focusPage("#roleId"),
            name: com.focusPage("#roleName"),
            content: com.focusPage("#roleDes"),

            chainList: com.focusPage("#chainList"),
            currentchainPage: com.focusPage("#currentchainPage"),

            chartList: com.focusPage("#chartList"),
            currentchartPage: com.focusPage("#currentchartPage"),

            taskList: com.focusPage("#taskList"),
            taskPermList: com.focusPage("#taskPermList"),

        },

        modals: {
            roleModal: com.focusPage("#roleModal"),
            moduleModal: com.focusPage("#moduleModal"),
            operationModal: com.focusPage("#operationModal"),
            taskModal: com.focusPage("#taskModal"),

            chainPageModal: com.focusPage("#chainPageModal"),
            chartPageModal: com.focusPage("#chartPageModal"),

        },

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            saveOperationBtn: com.focusPage('button[name="saveBtn"]', '#operationModal').on("click", saveOperation),
            saveModuleBtn: com.focusPage('button[name="saveBtn"]', '#moduleModal').on("click", saveModule),
            saveTaskBtn: com.focusPage('button[name="saveTaskBtn"]').bind('click', saveTask),
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

    com.post(api.data.queryTask, {
        "task.level": 0
    }, function(res) {

        $.each(res.tasks, function(i, v) {

            var $div = $('<div class="tag"></div>');
            var $input = $('<input/>').attr({
                "type": "checkbox",
                "value": v.name,
                "name": "corporabtask",
                "id": v.tid,
                "class": "ace"
            });
            var $span = $('<span></span>').html(v.name).addClass('lbl');

            $div.append($input).append($span).appendTo(role.items.taskList);
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
            var $btnModule = $('<a></a>').addClass('btn btn-minier btn-success').html('模块配置');
            var $btnTask = $('<a></a>').addClass('btn btn-minier btn-danger').html('任务配置');
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
                $divBtnWrap.append($chainPage).append($btnModule).append($btnTask).append($officeModule).append($btnOperation).append($btnEdit).append($btnDel).append($btnChart).appendTo($h3);
            } else {
                $divBtnWrap.append($btnModule).append($btnTask).appendTo($h3);
            }

            $liLine.append($h3).append($ulProperty);

            $btnModule.click(function() {

                role.rid = v.rid;

                queryModuleByRoleId(v.rid, 1);

                role.modals.moduleModal.modal('show');
            });

            $btnTask.bind('click', function() {

                role.rid = v.rid;

                role.items.taskPermList.html("");

                com.focusPage("input[type='checkbox']", "#taskList").prop("checked", false);

                com.post(api.data.queryTaskRoleRightByRid, {
                    "taskRoleRight.rid": v.rid
                }, function(res) {

                    $.each(res.taskRoleRights, function(i, v) {

                        var $div = $('<div></div>').appendTo(role.items.taskPermList);
                        var $span = $('<span class="tag"></span>').html(v.task.name).appendTo($div);

                        com.focusPage("#" + v.task.tid, "#taskList").prop("checked", true);
                    });
                });

                role.modals.taskModal.modal("show");
            });

            $officeModule.click(function() {

                role.rid = v.rid;

                queryModuleByRoleId(v.rid, 2);

                role.modals.moduleModal.modal('show');
            });

            $btnOperation.click(function() {

                role.rid = v.rid;

                queryOperationByRoleId(v.rid);

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

    function queryOperationByRoleId(rid) {

        var $wrap = com.focusPage('#operationModal').find('.modal-body').empty();

        com.post(api.system.queryOperation, {
            'operation.system': 1
        }, function(data) {

            if (data.operations.length) {
                $.each(data.operations, function(i, v) {

                    var $indexInput = $('<input>').attr({
                        type: 'checkbox',
                        name: 'operation',
                        'data-oid': v.oid
                    }).addClass('ace').val(v.oid);

                    var $label = $('<label style="margin-right:20px;display: inline-block;min-width: 25%;"></label>').append($indexInput).append('<span class="lbl">' + v.name + '</span>').appendTo($wrap);

                });
            }
        }, null, false);

        // 获取角色的操作
        com.post(api.system.queryOperationByRid, {
            'operation.system': 1,
            "role.rid": rid
        }, function(data) {

            if (data.operations.length) {
                $.each(data.operations, function(i, v) {

                    $wrap.find('input[value="' + v.oid + '"]').prop('checked', true);
                });
            }
        }, null, false);
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
            "taskRoleRight.rid": role.rid
        };

        $.each($inputs, function(i, v) {

            var $input = $(v);
            var row = {
                "tid": $input.attr('id')
            };

            params["tids[" + i + "]"] = row.tid;
        });

        com.post(api.data.updateTaskRoleRight, params, function(res) {

            role.rid = null;

            role.modals.taskModal.modal("hide");
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

});
