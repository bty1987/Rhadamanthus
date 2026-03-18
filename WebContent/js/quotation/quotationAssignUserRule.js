/**
 * 预算员规则管理 - 使用 Searcher 组件
 */
jQuery(function($) {

	// 加载用户列表（用于编辑对话框）
	function loadUserOptions() {
		com.post(api.personel.queryUserForOption, {
			"user.company": params.userInfo.company.cid,
			"user.status": 1
		}, function(res) {
			var html = '<option value="">请选择用户</option>';
			$.each(res.users || [], function(i, user) {
				html += '<option value="' + user.uid + '">' + user.currentName + ' (工号:' + user.userNo + ')</option>';
			});
			com.focusPage('#userId').html(html);
			com.focusPage('#userId').chosen({ allow_single_deselect: true });
		});
	}

	// 加载统计信息
	function loadStatistics() {
		com.post(api.quotation.getBudgetUserStatistics, {
			"company": params.userInfo.company.cid,
			"department": params.userInfo.user.department
		}, function(res) {
			var stats = res.statistics || {};
			com.focusPage('#availableCount').text(stats.availableCount || 0);
			com.focusPage('#busyCount').text(stats.busyCount || 0);
			com.focusPage('#stoppedCount').text(stats.stoppedCount || 0);
		});
	}

	// 打开编辑对话框
	function openEditModal(qaurid) {
		com.focusPage('#editForm')[0].reset();
		com.focusPage('#qaurid').val('');
		com.focusPage('input[name="supportType"]').prop('checked', false);

		if (qaurid) {
			com.focusPage('#modalTitle').text('编辑预算员');

			// 查询详情
			com.post(api.quotation.getBudgetUserRule, {
				"qaurid": qaurid
			}, function(res) {
				var rule = res.budgetUserRule;
				com.focusPage('#qaurid').val(rule.qaurid);
				com.focusPage('#userId').val(rule.userId).trigger('chosen:updated');
				com.focusPage('#maxTasks').val(rule.maxTasks || 5);

				// 加载支持类型
				com.post(api.quotation.getBudgetUserTypes, {
					"qaurid": qaurid
				}, function(typeRes) {
					com.focusPage('input[name="supportType"]').each(function() {
						$(this).prop('checked', $.inArray(parseInt($(this).val()), typeRes.types || []) !== -1);
					});
				});
			});
		} else {
			com.focusPage('#modalTitle').text('新增预算员');
		}

		com.focusPage('#editModal').modal('show');
	}

	// 保存
	function save() {
		var qaurid = com.focusPage('#qaurid').val();
		var userId = com.focusPage('#userId').val();

		if (!userId) {
			com.showAlert(com.warning, '请选择用户');
			return false;
		}

		// 收集支持类型
		var types = [];
		com.focusPage('input[name="supportType"]:checked').each(function() {
			types.push(parseInt($(this).val()));
		});

		if (types.length === 0) {
			com.showAlert(com.warning, '请至少选择一种支持类型');
			return false;
		}

		var params = {
			"budgetUserRule.qaurid": qaurid || null,
			"budgetUserRule.userId": userId,
			"budgetUserRule.company": params.userInfo.company.cid,
			"budgetUserRule.department": params.userInfo.user.department,
			"budgetUserRule.maxTasks": parseInt(com.focusPage('#maxTasks').val()) || 5,
			"budgetUserRule.status": qaurid ? undefined : 1
		};

		com.post(api.quotation.saveBudgetUserRule, params, function(res) {
			if (res.success) {
				com.showAlert(com.info, '保存成功');

				// 保存支持类型
				var newBurid = qaurid || res.qaurid;
				com.post(api.quotation.assignBudgetUserTypes, {
					"qaurid": newBurid,
					"types": types
				}, function() {
					com.focusPage('#editModal').modal('hide');
					searcher.doSearch();
				});
			} else {
				com.showAlert(com.error, res.message);
			}
		});
	}

	// 删除
	function deleteRule(qaurid) {
		com.showConfirm('确认删除该预算员规则？', function() {
			com.post(api.quotation.deleteBudgetUserRule, {
				"qaurid": qaurid
			}, function(res) {
				if (res.success) {
					com.showAlert(com.info, '删除成功');
					searcher.doSearch();
				} else {
					com.showAlert(com.error, res.message);
				}
			});
		});
	}

	// 启用/停用
	function toggleStatus(qaurid, currentStatus) {
		var willEnable = currentStatus == 3; // 已停用时启用
		var apiMethod = willEnable ? api.quotation.enableBudgetUser : api.quotation.disableBudgetUser;
		var actionText = willEnable ? '启用' : '停用';

		com.showConfirm('确认' + actionText + '该预算员？', function() {
			com.post(apiMethod, {
				"qaurid": qaurid
			}, function(res) {
				if (res.success) {
					com.showAlert(com.info, actionText + '成功');
					searcher.doSearch();
				} else {
					com.showAlert(com.error, res.message);
				}
			});
		});
	}

	// 显示工作负载
	function showWorkload() {
		com.post(api.quotation.getBudgetUserWorkload, {
			"company": params.userInfo.company.cid,
			"department": params.userInfo.user.department
		}, function(res) {
			var workloads = res.workloads || [];
			var html = '';

			if (workloads.length === 0) {
				html = '<tr><td colspan="5" class="text-center">暂无数据</td></tr>';
			} else {
				$.each(workloads, function(i, item) {
					var loadRate = item.maxTasks > 0 ? Math.round((item.currentTaskCount / item.maxTasks) * 100) : 0;
					var statusColor = loadRate >= 100 ? 'red' : (loadRate >= 80 ? 'orange' : 'green');
					var statusText = item.status == 1 ? '可用' : (item.status == 2 ? '忙碌' : '已停用');

					html += '<tr>';
					html += '<td>' + item.userName + '</td>';
					html += '<td>' + item.currentTaskCount + '</td>';
					html += '<td>' + item.maxTasks + '</td>';
					html += '<td><span style="color:' + statusColor + ';font-weight:bold;">' + loadRate + '%</span></td>';
					html += '<td>' + statusText + '</td>';
					html += '</tr>';
				});
			}

			com.focusPage('#workloadBody').html(html);
			com.focusPage('#workloadModal').modal('show');
		});
	}

	// 创建 Searcher 实例
	var searcher = new Searcher();

	// 设置基础配置
	searcher.base(
		"condList",                                 // 查询条件容器ID
		"pagenation",                               // 分页容器ID
		"resultList",                               // 结果容器ID
		api.quotation.pageBudgetUserRule           // API接口
	);

	// 设置结果数据名称
	searcher.result("budgetUserRules");

	// 设置额外参数（公司、部门）
	searcher.param({
		"budgetUserRule.company": params.userInfo.company.cid,
		"budgetUserRule.department": params.userInfo.user.department
	});

	// 设置查询条件
	searcher.condition([
		"quotation-budgetUserRule-status",
		"quotation-budgetUserRule-userName"
	]);

	// 设置工具按钮
	searcher.button(function() {
		var $addBtn = $('<a></a>')
			.addClass('btn btn-minier btn-success pull-left')
			.attr('id', 'addRuleBtn')
			.css('margin', '0px 3px');
		$('<i></i>').addClass('icon-plus bigger-110').appendTo($addBtn);
		$('<span></span>').text('新增预算员').appendTo($addBtn);

		var $workloadBtn = $('<a></a>')
			.addClass('btn btn-minier btn-info pull-left')
			.attr('id', 'workloadBtn')
			.css('margin', '0px 3px');
		$('<i></i>').addClass('icon-bar-chart bigger-110').appendTo($workloadBtn);
		$('<span></span>').text('工作负载').appendTo($workloadBtn);

		return [$addBtn, $workloadBtn];
	});

	// 定义列表列配置
	var lineprops = [{
		field: "qaurid",
		name: "多选",
		type: "checkbox",
		prop: "qaurid"
	}, {
		field: "userNo",
		name: "工号",
		prop: "userNo",
		clazz: "grey"
	}, {
		field: "userName",
		name: "姓名",
		prop: "userName",
		clazz: "blue"
	}, {
		field: "departmentName",
		name: "部门",
		prop: function(v) {
			return v.departmentName || '<span class="grey">-</span>';
		},
		clazz: "grey"
	}, {
		field: "status",
		name: "状态",
		prop: function(v) {
			var statusMap = {
				1: '<span class="label label-success">可用</span>',
				2: '<span class="label label-warning">忙碌</span>',
				3: '<span class="label label-default">已停用</span>'
			};
			return statusMap[v.status] || '-';
		}
	}, {
		field: "taskCount",
		name: "当前任务数",
		prop: function(v) {
			return (v.currentTaskCount || 0) + ' / ' + (v.maxTasks || 5);
		},
		clazz: "grey"
	}, {
		field: "supportedTypes",
		name: "支持类型",
		prop: function(v) {
			var typeMap = { 1: '半包', 2: '整装' };
			var types = (v.supportedTypes || '').split(',').map(function(t) {
				return typeMap[t.trim()] || '';
			}).filter(function(t) {
				return t;
			});
			return types.length > 0 ? types.join('、') : '<span class="grey">-</span>';
		},
		clazz: "grey"
	}];

	// 定义行操作按钮
	var linebtns = {
		'edit': {
			name: "编辑",
			clazz: "btn-info",
			handle: function(v) {
				openEditModal(v.qaurid);
			}
		},
		'toggle': {
			name: function(v) {
				return v.status == 3 ? '启用' : '停用';
			},
			clazz: function(v) {
				return v.status == 3 ? 'btn-success' : 'btn-warning';
			},
			handle: function(v) {
				toggleStatus(v.qaurid, v.status);
			}
		},
		'delete': {
			name: "删除",
			clazz: "btn-danger",
			handle: function(v) {
				deleteRule(v.qaurid);
			}
		}
	};

	// 渲染列表
	searcher.line("userName", lineprops, linebtns).render();

	// 绑定新增按钮事件
	com.focusPage('#addRuleBtn', '#pagenation').on('click', function() {
		openEditModal(null);
	});

	// 绑定工作负载按钮事件
	com.focusPage('#workloadBtn', '#pagenation').on('click', showWorkload);

	// 绑定保存按钮事件
	com.focusPage('#saveBtn').on('click', save);

	// 初始化
	loadUserOptions();
	loadStatistics();
});
