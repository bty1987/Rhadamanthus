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

        // 性能优化相关缓存
        moduleCache: new Map(), // 模块数据缓存
        searchKeyword: '',
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
                $divBtnWrap.append($chainPage).append($btnModule).append($btnTask).append($officeModule).append($btnOperation).append($btnChart).append($btnEdit).append($btnDel).appendTo($h3);
            } else {
                $divBtnWrap.append($btnModule).append($btnTask).appendTo($h3);
            }

            $liLine.append($h3).append($ulProperty);

            $btnModule.click(function() {

                role.rid = v.rid;

                queryModuleByRoleId(v.rid, 1);

                role.modals.moduleModal.modal('show');
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
        role.rid = roleId;

        // 生成缓存键
        var cacheKey = `modules_level1_${system}_${roleId}`;

        // 初始化模块数据缓存结构（每次都重新初始化，避免状态混乱）
        role.moduleCache.set('moduleData', {
            level1: [],
            level2: {},
            level3: {},
            rightsMap: {}
        });

        var $wrap = com.focusPage('#moduleModal').find('.modal-body');

        // 显示加载提示
        $wrap.html(`
            <div class="text-center" style="padding: 50px;">
                <i class="ace-icon fa fa-spinner fa-spin fa-2x"></i>
                <p>正在加载模块数据...</p>
            </div>
        `);

        // 首先加载第1级模块
        com.post(api.system.queryModuleForLogin, {
            'module.system': system,
            'module.level': 1  // 只加载第1级
        }, function(data) {
            // 加载角色权限（按层级过滤）
            com.post(api.system.queryModuleByRid, {
                'module.system': system,
                'module.level': 1,  // 同样只加载第1级的权限
                "role.rid": roleId
            }, function(rightsData) {
                // 处理1级模块数据
                var moduleData = role.moduleCache.get('moduleData');
                moduleData.level1 = data.modules || [];

                // 为1级模块设置层级属性
                $.each(moduleData.level1, function(i, v) {
                    v.level = 1;
                    v.fatherModule = null;
                });

                // 处理权限数据
                if (rightsData.modules && rightsData.modules.length) {
                    $.each(rightsData.modules, function(i, v) {
                        moduleData.rightsMap[v.mid] = v;
                    });
                }

                // 渲染模块树
                setTimeout(function() {
                    renderModuleTreeLazy(moduleData);
                }, 50);
            });
        }, function() {
            $wrap.html(`
                <div class="text-center" style="padding: 50px; color: red;">
                    <i class="ace-icon fa fa-exclamation-triangle fa-2x"></i>
                    <p>加载模块数据失败</p>
                </div>
            `);
        });
    }

    // 懒加载渲染函数
    function renderModuleTreeLazy(moduleData) {
        var $wrap = com.focusPage('#moduleModal').find('.modal-body');

        // 创建搜索框
        var $searchBox = $(`
            <div class="row" style="margin-bottom: 15px;">
                <div class="col-xs-12">
                    <div class="input-group">
                        <input type="text" class="form-control" id="moduleSearchInput" placeholder="搜索模块名称...">
                        <span class="input-group-btn">
                            <button class="btn btn-default btn-sm" type="button">
                                <i class="ace-icon fa fa-search"></i>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        `);

        // 创建滚动容器
        var $scrollContainer = $(`
            <div id="moduleScrollContainer" style="height: 400px; overflow-y: auto; border: 1px solid #ddd;">
                <ol class="dd-list" id="moduleListRoot"></ol>
            </div>
        `);

        $wrap.empty().append($searchBox).append($scrollContainer);

        // 绑定搜索事件
        var searchInput = $searchBox.find('#moduleSearchInput');
        searchInput.on('input', debounce(function() {
            role.searchKeyword = $(this).val().toLowerCase();
            renderModuleListLazy();
        }, 300));

        // 初始渲染1级模块
        renderModuleListLazy();
    }

    // 渲染模块列表（懒加载版本）
    function renderModuleListLazy() {
        var $list = $('#moduleListRoot');
        var moduleData = role.moduleCache.get('moduleData');

        $list.empty();

        // 使用文档片段批量操作
        var fragment = document.createDocumentFragment();

        // 1级菜单
        if (moduleData.level1.length) {
            $.each(moduleData.level1, function(i, v) {
                // 确保1级模块有正确的层级属性
                v.level = 1;
                v.fatherModule = null;
                var $li = createModuleItemLazy(v, 1);
                fragment.appendChild($li[0]);
            });
        }

        $list.append(fragment);

        // 添加全局事件委托，处理动态加载的模块权限变更
        $list.off('change', '.module-permission').on('change', '.module-permission', function() {
            var $checkbox = $(this);
            var mid = parseInt($checkbox.data('mid'));
            var level = parseInt($checkbox.data('level'));

            // 从缓存中找到模块数据
            var moduleData = role.moduleCache.get('moduleData');
            var module = null;

            // 根据层级查找模块
            if (level === 1) {
                module = moduleData.level1.find(function(m) { return m.mid === mid; });
            } else if (level === 2) {
                for (var parentId in moduleData.level2) {
                    var modules = moduleData.level2[parentId];
                    module = modules.find(function(m) { return m.mid === mid; });
                    if (module) break;
                }
            } else if (level === 3) {
                for (var parentId in moduleData.level3) {
                    var modules = moduleData.level3[parentId];
                    module = modules.find(function(m) { return m.mid === mid; });
                    if (module) break;
                }
            }

            console.log('事件委托找到模块:', {
                mid: mid,
                level: level,
                module: module ? { id: module.mid, name: module.name, level: module.level } : null
            });

            if (module) {
                handleModulePermissionChange($checkbox, module);
            } else {
                console.error('未找到模块数据:', { mid: mid, level: level });
            }
        });
    }

    // 创建模块项（支持懒加载）
    function createModuleItemLazy(module, level) {
        var $li = $('<li></li>').addClass('dd-item').attr('data-mid', module.mid).attr('data-level', level);
        if (level === 3) {
            $li.addClass('item-blue2');
        }

        var $div = $('<div></div>').addClass('dd-handle clearfix');

        // 模块名称
        var $nameSpan = $('<span class="module-name"></span>').text(module.name + "-" + module.alias);
        $div.append($nameSpan);

        // 添加展开按钮（1级和2级菜单）
        if (level < 3) {
            var $expandBtn = $('<button type="button" class="btn btn-xs btn-info pull-left" style="margin-right: 5px;">' +
                '<i class="ace-icon fa fa-plus"></i></button>');
            $div.append($expandBtn);

            // 绑定点击事件
            $expandBtn.on('click', function(e) {
                e.stopPropagation();
                loadChildModules(module, level, $li);
            });
        }

        // 添加权限复选框
        var $rightsDiv = createRightsCheckboxes(module);
        $div.append($rightsDiv);

        $li.append($div);

        // 如果有子模块，添加子容器
        if (level < 3) {
            var $childContainer = $('<ol class="dd-list hide"></ol>');
            $li.append($childContainer);
        }

        return $li;
    }

    // 创建权限复选框
    function createRightsCheckboxes(module) {
        var $rightsDiv = $('<div></div>').addClass('pull-right');
        var moduleData = role.moduleCache.get('moduleData');
        var rights = moduleData.rightsMap[module.mid];

        // 模块权限
        var $moduleCheck = $('<div></div>').addClass('checkbox').css({
            'margin-bottom': '0',
            'margin-top': '-5px',
            'display': 'inline-block',
            'margin-right': '5px'
        });
        var $moduleInput = $('<input type="checkbox" name="module" data-mid="' + module.mid + '" data-level="' + module.level + '">')
            .addClass('ace module-permission')
            .val(module.mid);
        var $moduleLabel = $('<label></label>').append($moduleInput).append('<span class="lbl">权限</span>');

        if (rights) {
            $moduleInput.prop('checked', true);
        }

        // 注意：模块权限变更事件通过全局事件委托处理，无需单独绑定

        $moduleCheck.append($moduleLabel);
        $rightsDiv.append($moduleCheck);

        // 快捷方式和访问权限（仅对有URL的模块）
        if (module.url && module.url !== '') {
            // 快捷方式
            var $linkCheck = $('<div></div>').addClass('checkbox').css({
                'margin-bottom': '0',
                'margin-top': '-5px',
                'display': 'inline-block',
                'margin-right': '5px'
            });
            var $linkInput = $('<input type="checkbox" name="link">')
                .addClass('ace')
                .val(module.mid);

            if (rights && rights.link === 0) {
                $linkInput.prop('checked', true);
            }

            var $linkLabel = $('<label></label>').append($linkInput).append('<span class="lbl">快捷</span>');
            $linkCheck.append($linkLabel);
            $rightsDiv.append($linkCheck);

            // 访问权限
            var $accessCheck = $('<div></div>').addClass('checkbox').css({
                'margin-bottom': '0',
                'margin-top': '-5px',
                'display': 'inline-block'
            });
            var $accessInput = $('<input type="checkbox" name="access">')
                .addClass('ace')
                .val(module.mid);

            if (rights && rights.access === 0) {
                $accessInput.prop('checked', true);
            }

            var $accessLabel = $('<label></label>').append($accessInput).append('<span class="lbl">访问</span>');
            $accessCheck.append($accessLabel);
            $rightsDiv.append($accessCheck);
        }

        return $rightsDiv;
    }

    // 加载子模块
    function loadChildModules(parentModule, parentLevel, $parentLi) {
        var childLevel = parentLevel + 1;
        var cacheKey = `level${childLevel}_${parentModule.mid}`;
        var moduleData = role.moduleCache.get('moduleData');
        var $childContainer = $parentLi.find('>.dd-list');
        var $expandBtn = $parentLi.find('>.dd-handle button');

        // 检查是否已经加载
        if (moduleData['level' + childLevel][parentModule.mid]) {
            // 已加载，直接切换显示状态
            toggleChildContainer($childContainer, $expandBtn);
            return;
        }

        // 显示加载状态
        $expandBtn.html('<i class="ace-icon fa fa-spinner fa-spin"></i>');

        // 请求子模块数据（带权限）
        com.post(api.system.queryModuleForLogin, {
            'module.system': role.system,
            'module.level': childLevel,
            'module.fatherModule.mid': parentModule.mid
        }, function(data) {
            // 同时请求该层级角色权限
            com.post(api.system.queryModuleByRid, {
                'module.system': role.system,
                'module.level': childLevel,
                'module.fatherModule.mid': parentModule.mid,
                "role.rid": role.rid
            }, function(rightsData) {
                // 恢复按钮状态
                if (data.modules && data.modules.length > 0) {
                    // 更新按钮图标为减号（展开状态）
                    var $icon = $expandBtn.find('i');
                    $icon.removeClass('fa-spinner fa-spin fa-plus').addClass('fa-minus');

                    // 更新权限数据
                    if (rightsData.modules && rightsData.modules.length) {
                        $.each(rightsData.modules, function(i, v) {
                            moduleData.rightsMap[v.mid] = v;
                        });
                    }

                    // 缓存子模块数据并建立父子关系
                    var childModules = data.modules || [];
                    moduleData['level' + childLevel][parentModule.mid] = childModules;

                    // 为子模块设置父模块引用
                    $.each(childModules, function(i, childModule) {
                        childModule.fatherModule = parentModule;
                        childModule.level = childLevel;
                    });

                    // 渲染子模块（包含权限状态）
                    renderChildModules(childModules, childLevel, $childContainer);

                    // 显示子容器
                    $childContainer.removeClass('hide');
                } else {
                    // 没有子模块，移除按钮
                    $expandBtn.remove();
                }
            });
        }, function() {
            // 加载失败，恢复按钮
            var $icon = $expandBtn.find('i');
            $icon.removeClass('fa-spinner fa-spin fa-minus').addClass('fa-plus');
        });
    }

    // 渲染子模块
    function renderChildModules(modules, level, $container) {
        var fragment = document.createDocumentFragment();

        $.each(modules, function(i, v) {
            var $li = createModuleItemLazy(v, level);
            fragment.appendChild($li[0]);
        });

        $container.empty().append(fragment);
    }

    // 切换子容器显示/隐藏
    function toggleChildContainer($container, $expandBtn) {
        var $icon = $expandBtn.find('i');

        if ($container.hasClass('hide')) {
            // 显示容器
            $container.removeClass('hide');
            $icon.removeClass('fa-plus').addClass('fa-minus');
        } else {
            // 隐藏容器
            $container.addClass('hide');
            $icon.removeClass('fa-minus').addClass('fa-plus');
        }
    }

    // 处理模块权限变更（实现级联选中）
    function handleModulePermissionChange($checkbox, module) {
        var isChecked = $checkbox.prop('checked');
        var moduleData = role.moduleCache.get('moduleData');

        console.log('权限变更:', {
            moduleId: module.mid,
            name: module.name,
            level: module.level,
            checked: isChecked,
            fatherModule: module.fatherModule ? module.fatherModule.name : 'null'
        });

        if (isChecked) {
            // 选中子模块，需要选中父模块
            console.log('选中子模块，开始更新父模块...');
            updateParentModules(module.mid, module.level, true);
        } else {
            // 取消选中父模块，需要取消选中所有子模块
            console.log('取消选中模块，开始更新子模块...');
            updateChildModules(module.mid, module.level, false);
        }
    }

    // 更新父模块状态
    function updateParentModules(moduleId, currentLevel, check) {
        if (currentLevel <= 1) return; // 已经是1级，没有父模块

        var moduleData = role.moduleCache.get('moduleData');

        // 查找父模块 - 简化版本，基于缓存结构查找
        function findParentModule(moduleId, level) {
            console.log('查找父模块开始:', { moduleId: moduleId, level: level });

            // 先打印缓存结构用于调试
            console.log('缓存结构调试:', {
                'level2 keys': Object.keys(moduleData.level2),
                'level3 keys': Object.keys(moduleData.level3),
                'level3数据': moduleData.level3
            });

            if (level === 2) {
                // 2级模块的父模块是1级模块 - 遍历所有1级模块的2级子模块
                console.log('查找2级模块的父模块...');
                for (var i = 0; i < moduleData.level1.length; i++) {
                    var level1Module = moduleData.level1[i];
                    if (moduleData.level2[level1Module.mid]) {
                        console.log('检查1级模块的子模块:', level1Module.mid, level1Module.name, '子模块数量:', moduleData.level2[level1Module.mid].length);
                        for (var j = 0; j < moduleData.level2[level1Module.mid].length; j++) {
                            var level2Module = moduleData.level2[level1Module.mid][j];
                            console.log('比较2级模块:', level2Module.mid, '目标:', moduleId);
                            if (level2Module.mid == moduleId) {
                                console.log('✓ 找到2级模块的父模块:', {
                                    childModule: { id: moduleId, name: level2Module.name },
                                    parentModule: { id: level1Module.mid, name: level1Module.name, level: 1 }
                                });
                                // 确保父模块有正确的level属性
                                level1Module.level = 1;
                                return level1Module;
                            }
                        }
                    }
                }
            } else if (level === 3) {
                // 3级模块的父模块是2级模块 - 遍历所有2级模块的3级子模块
                console.log('查找3级模块的父模块...');
                console.log('所有level3的parentId:', Object.keys(moduleData.level3));

                for (var parentId in moduleData.level3) {
                    var level3Modules = moduleData.level3[parentId];
                    console.log('检查parentId:', parentId, '子模块数量:', level3Modules.length);

                    for (var i = 0; i < level3Modules.length; i++) {
                        var level3Module = level3Modules[i];
                        console.log('比较3级模块:', level3Module.mid, '目标:', moduleId);
                        if (level3Module.mid == moduleId) {
                            console.log('找到匹配的3级模块，parentId:', parentId);
                            // parentId就是对应的2级模块ID
                            if (moduleData.level2[parentId] && moduleData.level2[parentId].length > 0) {
                                var parentLevel2Module = moduleData.level2[parentId][0];
                                // 确保2级模块有正确的level属性
                                parentLevel2Module.level = 2;
                                console.log('✓ 找到3级模块的父模块:', {
                                    childModule: { id: moduleId, name: level3Module.name },
                                    parentModule: { id: parentLevel2Module.mid, name: parentLevel2Module.name, level: 2 }
                                });
                                return parentLevel2Module;
                            } else {
                                console.log('❗ 找到parentId但在level2中不存在:', parentId);
                            }
                        }
                    }
                }
            }

            console.log('✗ 未找到父模块:', { moduleId: moduleId, level: level });
            return null;
        }

        var parentModule = findParentModule(moduleId, currentLevel);

        console.log('查找父模块结果:', {
            childModuleId: moduleId,
            childLevel: currentLevel,
            parentModule: parentModule ? { id: parentModule.mid, name: parentModule.name, level: parentModule.level } : null
        });

        if (parentModule) {
            var $parentCheckbox = $('.module-permission[data-mid="' + parentModule.mid + '"]');
            console.log('父模块复选框查找结果:', {
                parentId: parentModule.mid,
                selector: '.module-permission[data-mid="' + parentModule.mid + '"]',
                found: $parentCheckbox.length > 0,
                currentChecked: $parentCheckbox.length > 0 ? $parentCheckbox.prop('checked') : 'N/A'
            });

            if ($parentCheckbox.length > 0) {
                $parentCheckbox.prop('checked', check);
                console.log('✓ 设置父模块选中:', parentModule.mid, parentModule.name, 'checked:', check);

                // 递归更新上级父模块
                updateParentModules(parentModule.mid, parentModule.level, check);
            } else {
                console.log('✗ 未找到父模块复选框:', parentModule.mid, parentModule.name);
            }
        } else {
            console.log('✗ 未找到父模块');
        }
    }


    // 更新子模块状态 - 基于mid关系
    function updateChildModules(parentId, parentLevel, check) {
        if (parentLevel >= 3) return; // 已经是3级，没有子模块

        console.log('更新子模块状态:', { parentId: parentId, parentLevel: parentLevel, check: check });

        var childLevel = parentLevel + 1;
        var moduleData = role.moduleCache.get('moduleData');

        if (childLevel === 2 && moduleData.level2[parentId]) {
            // 更新2级子模块
            console.log('找到2级子模块数量:', moduleData.level2[parentId].length);
            $.each(moduleData.level2[parentId], function(i, childModule) {
                var $childCheckbox = $('.module-permission[data-mid="' + childModule.mid + '"]');
                if ($childCheckbox.length > 0) {
                    $childCheckbox.prop('checked', check);
                    console.log('设置2级子模块:', childModule.mid, childModule.name, 'checked:', check);
                }

                // 递归更新3级子模块
                updateChildModules(childModule.mid, childLevel, check);
            });
        } else if (childLevel === 3 && moduleData.level3[parentId]) {
            // 更新3级子模块
            console.log('找到3级子模块数量:', moduleData.level3[parentId].length);
            $.each(moduleData.level3[parentId], function(i, childModule) {
                var $childCheckbox = $('.module-permission[data-mid="' + childModule.mid + '"]');
                if ($childCheckbox.length > 0) {
                    $childCheckbox.prop('checked', check);
                    console.log('设置3级子模块:', childModule.mid, childModule.name, 'checked:', check);
                }
            });
        } else {
            console.log('未找到子模块:', { parentId: parentId, childLevel: childLevel });
        }
    }

    // 工具函数：防抖
    function debounce(func, delay) {
        var timer;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                func.apply(context, args);
            }, delay);
        };
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

});
