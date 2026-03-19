/**
 * 待分配队列管理 - 使用 Searcher 组件
 */
jQuery(function($) {

	// 加载统计信息
	function loadStatistics() {
		com.post(api.quotation.statisQuotationAssignRequest, {
			"quotationAssignRequest.company": params.userInfo.company.cid,
			"quotationAssignRequest.department": params.userInfo.user.department ? params.userInfo.user.department.did : null
		}, function(res) {
			var stats = res.statistics || {};
			com.focusPage('#pendingCount').text(stats.pendingCount || 0);
			com.focusPage('#processingCount').text(stats.processingCount || 0);
			com.focusPage('#todayAssignedCount').text(stats.todayAssignedCount || 0);
			com.focusPage('#avgWaitTime').text(stats.avgWaitTime || 0);
		});
	}

	// 加载可用预算员
	function loadAvailableBudgetUsers() {
		com.post(api.quotation.pullQuotationAssignUserRuleForPending, {
			"company": params.userInfo.company.cid,
			"quotationAssignUserRule.department": params.userInfo.user.department ? params.userInfo.user.department.did : null
		}, function(res) {
			var $budgetUserId = com.focusPage('#budgetUserId');

			// 先销毁已存在的chosen实例（如果有）
			if ($budgetUserId.data('chosen')) {
				$budgetUserId.chosen('destroy');
			}

			var html = '<option value="">请选择预算员</option>';
			$.each(res.quotationAssignUserRules || [], function(i, rule) {
				var user = rule.user;
				if (!user) return;

				var loadRate = rule.maxTasks > 0 ? Math.round((rule.currentTaskCount / rule.maxTasks) * 100) : 0;
				html += '<option value="' + rule.qaurid + '">';
				html += user.currentName + ' (当前任务: ' + (rule.currentTaskCount || 0) + '/' + (rule.maxTasks || 5) + ', 负载: ' + loadRate + '%)';
				html += '</option>';
			});
			$budgetUserId.html(html);

			// 重新初始化chosen
			$budgetUserId.chosen({ allow_single_deselect: true });
		});
	}

	// 打开手动分配对话框
	function openProcessModal(qarid, orderId) {
		com.focusPage('#processQarid').val(qarid);
		com.focusPage('#processOrderId').val(orderId);
		com.focusPage('#displayOrderId').text(orderId);
		com.focusPage('#budgetUserId').val('').trigger('chosen:updated');

		loadAvailableBudgetUsers();
		com.focusPage('#processModal').modal('show');
	}

	// 手动分配
	function manualProcess() {
		var qarid = com.focusPage('#processQarid').val();
		var orderId = com.focusPage('#processOrderId').val();
		var qaurid = com.focusPage('#budgetUserId').val();

		if (!qaurid) {
			com.showAlert(com.warning, '请选择预算员');
			return false;
		}

		com.post(api.quotation.manualQuotationAssign, {
			"quotationAssign.orderId": orderId,
			"quotationAssign.budgetUid": qaurid
		}, function(res) {
			if (res.success) {
				com.showAlert(com.info, '分配成功');
				com.focusPage('#processModal').modal('hide');
				searcher.doSearch();
				loadStatistics();
			} else {
				com.showAlert(com.error, res.message);
			}
		});
	}

	// 取消请求
	function cancelRequest(qarid) {
		com.showConfirm('确认取消该分配请求？', function() {
			com.post(api.quotation.cancelQuotationAssignRequest, {
				"quotationAssignRequest.qarid": qarid
			}, function(res) {
				if (res.success) {
					com.showAlert(com.info, '已取消');
					searcher.doSearch();
					loadStatistics();
				} else {
					com.showAlert(com.error, res.message);
				}
			});
		});
	}

	// 打开优先级调整对话框
	function openPriorityModal(qarid, orderId, currentPriority) {
		com.focusPage('#priorityQarid').val(qarid);
		com.focusPage('#priorityOrderId').text(orderId);
		com.focusPage('#prioritySelect').val(currentPriority);

		com.focusPage('#priorityModal').modal('show');
	}

	// 调整优先级
	function updatePriority() {
		var qarid = com.focusPage('#priorityQarid').val();
		var priority = parseInt(com.focusPage('#prioritySelect').val());

		com.post(api.quotation.updateQuotationAssignRequestForPriority, {
			"quotationAssignRequest.qarid": qarid,
			"quotationAssignRequest.priority": priority
		}, function(res) {
			if (res.success) {
				com.showAlert(com.info, '优先级已调整');
				com.focusPage('#priorityModal').modal('hide');
				searcher.doSearch();
			} else {
				com.showAlert(com.error, res.message);
			}
		});
	}

	// 创建 Searcher 实例
	var searcher = new Searcher();

	// 设置基础配置
	searcher.base(
		"condList",                                         // 查询条件容器ID
		"pagenation",                                       // 分页容器ID
		"resultList",                                       // 结果容器ID
		api.quotation.pageQuotationAssignRequest           // API接口
	);

	// 设置结果数据名称
	searcher.result("quotationAssignRequests");

	// 设置查询条件
	searcher.condition([
		"quotation-assignRequest-status",
		"quotation-assignRequest-priority",
		"quotation-assignRequest-orderId"
	]);

	// 设置工具按钮
	searcher.button(function() {
		var $refreshBtn = $('<a></a>')
			.addClass('btn btn-minier btn-primary pull-left')
			.attr('id', 'refreshBtn')
			.css('margin', '0px 3px');
		$('<i></i>').addClass('icon-refresh bigger-110').appendTo($refreshBtn);
		$('<span></span>').text('刷新').appendTo($refreshBtn);

		return [$refreshBtn];
	});

	// 定义列表列配置
	var lineprops = [{
		field: "qarid",
		name: "多选",
		type: "checkbox",
		prop: "qarid"
	}, {
		field: "orderId",
		name: "订单编号",
		prop: "orderId",
		clazz: "blue"
	}, {
		field: "customerName",
		name: "客户姓名",
		prop: function(v) {
			return v.customerName || '<span class="grey">-</span>';
		},
		clazz: "grey"
	}, {
		field: "decorationType",
		name: "装修类型",
		prop: function(v) {
			var typeMap = { 1: '半包', 2: '整装' };
			return typeMap[v.decorationType] || '<span class="grey">-</span>';
		},
		clazz: "grey"
	}, {
		field: "priority",
		name: "优先级",
		prop: function(v) {
			var priorityMap = {
				1: '<span class="badge badge-red">最高</span>',
				2: '<span class="badge badge-orange">高</span>',
				3: '<span class="badge badge-grey">普通</span>',
				4: '<span class="badge badge-light">低</span>'
			};
			return priorityMap[v.priority] || '-';
		}
	}, {
		field: "status",
		name: "状态",
		prop: function(v) {
			var statusMap = {
				1: '<span class="label label-warning">待处理</span>',
				2: '<span class="label label-info">处理中</span>',
				3: '<span class="label label-success">已完成</span>',
				4: '<span class="label label-default">已取消</span>'
			};
			return statusMap[v.status] || '-';
		}
	}, {
		field: "requestTime",
		name: "请求时间",
		prop: function(v) {
			return com.formatDate(v.requestTime, 'yyyy-MM-dd HH:mm');
		},
		clazz: "grey"
	}, {
		field: "waitTime",
		name: "等待时长",
		prop: function(v) {
			// 动态计算等待时长
			var waitMinutes = 0;
			if (v.requestTime) {
				var now = new Date().getTime();
				var requestTime = new Date(v.requestTime).getTime();
				waitMinutes = Math.floor((now - requestTime) / 60000);
			}
			var waitText = waitMinutes > 60 ? Math.floor(waitMinutes / 60) + '小时' : waitMinutes + '分钟';

			// 超过30分钟显示红色
			var colorClass = waitMinutes > 30 ? 'red' : 'grey';
			return '<span style="color:' + colorClass + ';font-weight:bold;">' + waitText + '</span>';
		},
		clazz: "grey"
	}];

	// 定义行操作按钮
	var linebtns = {
		'process': {
			name: "手动分配",
			clazz: "btn-primary",
			handle: function(v) {
				if (v.status != 1) {
					com.showAlert(com.warning, '只能处理待处理状态的请求');
					return;
				}
				openProcessModal(v.qarid, v.orderId);
			}
		},
		'priority': {
			name: "优先级",
			clazz: "btn-info",
			handle: function(v) {
				openPriorityModal(v.qarid, v.orderId, v.priority);
			}
		},
		'cancel': {
			name: "取消",
			clazz: "btn-danger",
			handle: function(v) {
				cancelRequest(v.qarid);
			},
			show: function(v) {
				return v.status == 1; // 只对待处理状态显示取消按钮
			}
		}
	};

	// 渲染列表
	searcher.line("orderId", lineprops, linebtns).render();

	// 绑定工具按钮事件
	com.focusPage('#refreshBtn', '#pagenation').on('click', function() {
		searcher.doSearch();
		loadStatistics();
	});

	// 绑定对话框按钮事件
	com.focusPage('#confirmProcessBtn').on('click', manualProcess);

	com.focusPage('#confirmPriorityBtn').on('click', updatePriority);

	// 初始化加载统计信息
	loadStatistics();

	// 定时刷新（每30秒）
	setInterval(function() {
		searcher.doSearch();
		loadStatistics();
	}, 30000);
});
