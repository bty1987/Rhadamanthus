/**
 * 待分配队列管理
 */
jQuery(function($) {

	var page = {
		pageNo: 1,
		pageSize: 20,
		total: 0
	};

	// 加载统计信息
	function loadStatistics() {
		com.post(api.quotation.getAssignRequestStatistics, {
			"company": params.userInfo.company.cid,
			"department": params.userInfo.user.department
		}, function(res) {
			var stats = res.statistics || {};
			com.focusPage('#pendingCount').text(stats.pendingCount || 0);
			com.focusPage('#processingCount').text(stats.processingCount || 0);
			com.focusPage('#todayAssignedCount').text(stats.todayAssignedCount || 0);
			com.focusPage('#avgWaitTime').text(stats.avgWaitTime || 0);
		});
	}

	// 加载列表
	function loadList() {
		com.post(api.quotation.pageAssignRequest, {
			"assignRequest.company": params.userInfo.company.cid,
			"assignRequest.department": params.userInfo.user.department,
			"assignRequest.status": $('#statusSelect').val(),
			"assignRequest.priority": $('#prioritySelect').val(),
			"assignRequest.orderId": $('#orderId').val(),
			"page.pageNo": page.pageNo,
			"page.pageSize": page.pageSize
		}, function(res) {
			renderList(res.requests || []);
			page.total = res.page ? res.page.total : 0;
			renderPagination();
			loadStatistics();
		});
	}

	// 渲染列表
	function renderList(list) {
		var html = '';

		if (list.length === 0) {
			html = '<tr><td colspan="9" class="text-center">暂无数据</td></tr>';
		} else {
			$.each(list, function(i, item) {
				var statusMap = {
					1: '<span class="label label-warning">待处理</span>',
					2: '<span class="label label-info">处理中</span>',
					3: '<span class="label label-success">已完成</span>',
					4: '<span class="label label-default">已取消</span>'
				};

				var priorityMap = {
					1: '<span class="badge badge-red">最高</span>',
					2: '<span class="badge badge-orange">高</span>',
					3: '<span class="badge badge-grey">普通</span>',
					4: '<span class="badge badge-light">低</span>'
				};

				var typeMap = { 1: '半包', 2: '整装' };

				// 计算等待时长
				var waitMinutes = 0;
				if (item.requestTime) {
					var now = new Date().getTime();
					var requestTime = new Date(item.requestTime).getTime();
					waitMinutes = Math.floor((now - requestTime) / 60000);
				}
				var waitText = waitMinutes > 60 ? Math.floor(waitMinutes / 60) + '小时' : waitMinutes + '分钟';

				html += '<tr>';
				html += '<td><input type="checkbox" class="row-checkbox" data-id="' + item.barid + '"></td>';
				html += '<td>' + item.orderId + '</td>';
				html += '<td>' + (item.customerName || '-') + '</td>';
				html += '<td>' + (typeMap[item.decorationType] || '-') + '</td>';
				html += '<td>' + (priorityMap[item.priority] || '-') + '</td>';
				html += '<td>' + (statusMap[item.status] || '-') + '</td>';
				html += '<td>' + com.formatDate(item.requestTime, 'yyyy-MM-dd HH:mm') + '</td>';
				html += '<td>' + waitText + '</td>';
				html += '<td>';
				html += '  <button class="btn btn-xs btn-primary process-btn" ';
				html += '    data-id="' + item.barid + '" ';
				html += '    data-order-id="' + item.orderId + '" ';
				html += '    data-status="' + item.status + '"><i class="icon-hand-right"></i> 手动分配</button> ';
				html += '  <button class="btn btn-xs btn-info priority-btn" data-id="' + item.barid + '" ';
				html += '    data-order-id="' + item.orderId + '" ';
				html += '    data-priority="' + item.priority + '"><i class="icon-sort"></i> 优先级</button> ';
				if (item.status == 1) {
					html += '  <button class="btn btn-xs btn-danger cancel-btn" data-id="' + item.barid + '"><i class="icon-remove"></i> 取消</button>';
				}
				html += '</td>';
				html += '</tr>';
			});
		}

		com.focusPage('#dataBody').html(html);
	}

	// 渲染分页
	function renderPagination() {
		var totalPages = Math.ceil(page.total / page.pageSize);
		var html = '';

		if (totalPages > 0) {
			html += '<div class="pagination-info">';
			html += '共 ' + page.total + ' 条记录，当前第 ' + page.pageNo + '/' + totalPages + ' 页';
			html += '</div>';

			html += '<ul class="pagination">';
			html += '<li class="' + (page.pageNo === 1 ? 'disabled' : '') + '">';
			html += '<a href="#" data-page="' + (page.pageNo - 1) + '">&laquo; 上一页</a>';
			html += '</li>';

			for (var i = 1; i <= totalPages; i++) {
				if (i === 1 || i === totalPages || (i >= page.pageNo - 2 && i <= page.pageNo + 2)) {
					html += '<li class="' + (i === page.pageNo ? 'active' : '') + '">';
					html += '<a href="#" data-page="' + i + '">' + i + '</a>';
					html += '</li>';
				} else if (i === page.pageNo - 3 || i === page.pageNo + 3) {
					html += '<li class="disabled"><a href="#">...</a></li>';
				}
			}

			html += '<li class="' + (page.pageNo === totalPages ? 'disabled' : '') + '">';
			html += '<a href="#" data-page="' + (page.pageNo + 1) + '">下一页 &raquo;</a>';
			html += '</li>';
			html += '</ul>';
		}

		com.focusPage('#pagination').html(html);
	}

	// 加载可用预算员
	function loadAvailableBudgetUsers() {
		com.post(api.quotation.pageAvailableBudgetUsers, {
			"company": params.userInfo.company.cid,
			"department": params.userInfo.user.department,
			"page.pageNo": 1,
			"page.pageSize": 1000
		}, function(res) {
			var html = '<option value="">请选择预算员</option>';
			$.each(res.budgetUsers || [], function(i, user) {
				var loadRate = user.maxTasks > 0 ? Math.round((user.currentTaskCount / user.maxTasks) * 100) : 0;
				html += '<option value="' + user.budgetUid + '">';
				html += user.userName + ' (当前任务: ' + user.currentTaskCount + '/' + user.maxTasks + ', 负载: ' + loadRate + '%)';
				html += '</option>';
			});
			$('#budgetUserId').html(html);
			$('#budgetUserId').chosen({ allow_single_deselect: true });
		});
	}

	// 打开手动分配对话框
	function openProcessModal(barid, orderId) {
		$('#processBarid').val(barid);
		$('#processOrderId').val(orderId);
		$('#displayOrderId').text(orderId);
		$('#budgetUserId').val('').trigger('chosen:updated');

		loadAvailableBudgetUsers();
		$('#processModal').modal('show');
	}

	// 手动处理
	function manualProcess() {
		var barid = $('#processBarid').val();
		var budgetUid = $('#budgetUserId').val();

		if (!budgetUid) {
			com.showAlert(com.warning, '请选择预算员');
			return false;
		}

		com.post(api.quotation.manualProcessPendingRequest, {
			"barid": barid,
			"budgetUid": budgetUid
		}, function(res) {
			if (res.success) {
				com.showAlert(com.info, '分配成功');
				$('#processModal').modal('hide');
				loadList();
			} else {
				com.showAlert(com.error, res.message);
			}
		});
	}

	// 取消请求
	function cancelRequest(barid) {
		com.showConfirm('确认取消该分配请求？', function() {
			com.post(api.quotation.cancelAssignRequest, {
				"barid": barid
			}, function(res) {
				if (res.success) {
					com.showAlert(com.info, '已取消');
					loadList();
				} else {
					com.showAlert(com.error, res.message);
				}
			});
		});
	}

	// 打开优先级调整对话框
	function openPriorityModal(barid, orderId, currentPriority) {
		$('#priorityBarid').val(barid);
		$('#priorityOrderId').text(orderId);
		$('#prioritySelect').val(currentPriority);

		$('#priorityModal').modal('show');
	}

	// 调整优先级
	function updatePriority() {
		var barid = $('#priorityBarid').val();
		var priority = parseInt($('#prioritySelect').val());

		com.post(api.quotation.updateAssignRequestPriority, {
			"barid": barid,
			"priority": priority
		}, function(res) {
			if (res.success) {
				com.showAlert(com.info, '优先级已调整');
				$('#priorityModal').modal('hide');
				loadList();
			} else {
				com.showAlert(com.error, res.message);
			}
		});
	}

	// 批量取消
	function batchCancel() {
		var barids = [];
		com.focusPage('.row-checkbox:checked').each(function() {
			barids.push($(this).data('id'));
		});

		if (barids.length === 0) {
			com.showAlert(com.warning, '请先选择要取消的请求');
			return false;
		}

		com.showConfirm('确认取消选中的 ' + barids.length + ' 条请求？', function() {
			com.post(api.quotation.batchCancelAssignRequests, {
				"barids": barids
			}, function(res) {
				if (res.success) {
					com.showAlert(com.info, '已取消 ' + res.canceledCount + ' 条请求');
					loadList();
				} else {
					com.showAlert(com.error, res.message);
				}
			});
		});
	}

	// 清除已完成请求
	function clearCompleted() {
		com.showConfirm('确认清除7天前的已完成请求？', function() {
			com.post(api.quotation.clearCompletedRequests, {
				"company": params.userInfo.company.cid,
				"department": params.userInfo.user.department,
				"days": 7
			}, function(res) {
				if (res.success) {
					com.showAlert(com.info, '已清除 ' + res.clearedCount + ' 条记录');
					loadList();
				} else {
					com.showAlert(com.error, res.message);
				}
			});
		});
	}

	// 事件绑定
	com.focusPage('#searchBtn').on('click', function() {
		page.pageNo = 1;
		loadList();
	});

	com.focusPage('#refreshBtn').on('click', function() {
		loadList();
	});

	com.focusPage('#batchCancelBtn').on('click', batchCancel);

	com.focusPage('#clearCompletedBtn').on('click', clearCompleted);

	com.focusPage('#dataBody').on('click', '.process-btn', function() {
		var $btn = $(this);
		if ($btn.data('status') != 1) {
			com.showAlert(com.warning, '只能处理待处理状态的请求');
			return false;
		}
		openProcessModal($btn.data('id'), $btn.data('order-id'));
	});

	com.focusPage('#dataBody').on('click', '.cancel-btn', function() {
		cancelRequest($(this).data('id'));
	});

	com.focusPage('#dataBody').on('click', '.priority-btn', function() {
		var $btn = $(this);
		openPriorityModal($btn.data('id'), $btn.data('order-id'), $btn.data('priority'));
	});

	com.focusPage('#confirmProcessBtn').on('click', manualProcess);

	com.focusPage('#confirmPriorityBtn').on('click', updatePriority);

	com.focusPage('#pagination').on('click', 'a[data-page]', function() {
		var targetPage = parseInt($(this).data('page'));
		if (targetPage > 0 && targetPage <= Math.ceil(page.total / page.pageSize)) {
			page.pageNo = targetPage;
			loadList();
		}
		return false;
	});

	// 定时刷新（每30秒）
	setInterval(function() {
		loadList();
	}, 30000);

	// 初始化
	loadList();
});
