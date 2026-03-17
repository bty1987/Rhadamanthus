/**
 * 预算员规则管理
 */
jQuery(function($) {

	// 初始化分页
	var page = {
		pageNo: 1,
		pageSize: 20,
		total: 0
	};

	// 加载列表
	function loadList() {
		com.post(api.quotation.pageBudgetUserRule, {
			"budgetUserRule.company": params.userInfo.company.cid,
			"budgetUserRule.status": $('#statusSelect').val(),
			"budgetUserRule.userName": $('#userName').val(),
			"page.pageNo": page.pageNo,
			"page.pageSize": page.pageSize
		}, function(res) {
			renderList(res.budgetUserRules || []);
			page.total = res.page ? res.page.total : 0;
			renderPagination();
			loadStatistics();
		});
	}

	// 渲染列表
	function renderList(list) {
		var html = '';

		if (list.length === 0) {
			html = '<tr><td colspan="8" class="text-center">暂无数据</td></tr>';
		} else {
			$.each(list, function(i, item) {
				var statusMap = {
					1: '<span class="label label-success">可用</span>',
					2: '<span class="label label-warning">忙碌</span>',
					3: '<span class="label label-default">已停用</span>'
				};

				html += '<tr>';
				html += '<td><input type="checkbox" class="row-checkbox" data-id="' + item.qaurid + '"></td>';
				html += '<td>' + (item.userNo || '-') + '</td>';
				html += '<td>' + (item.userName || '-') + '</td>';
				html += '<td>' + (item.departmentName || '-') + '</td>';
				html += '<td>' + (statusMap[item.status] || '-') + '</td>';
				html += '<td>' + (item.currentTaskCount || 0) + ' / ' + (item.maxTasks || 5) + '</td>';
				html += '<td>' + (item.supportedTypes || '-') + '</td>';
				html += '<td>';
				html += '  <button class="btn btn-xs btn-info edit-btn" data-id="' + item.qaurid + '"><i class="icon-edit"></i> 编辑</button> ';
				if (item.status == 3) {
					html += '  <button class="btn btn-xs btn-success enable-btn" data-id="' + item.qaurid + '"><i class="icon-ok"></i> 启用</button> ';
				} else {
					html += '  <button class="btn btn-xs btn-warning disable-btn" data-id="' + item.qaurid + '"><i class="icon-ban-circle"></i> 停用</button> ';
				}
				html += '  <button class="btn btn-xs btn-danger delete-btn" data-id="' + item.qaurid + '"><i class="icon-trash"></i> 删除</button>';
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

	// 加载用户列表
	function loadUserOptions() {
		com.post(api.personel.queryUserForOption, {
			"user.company": params.userInfo.company.cid,
			"user.status": 1
		}, function(res) {
			var html = '<option value="">请选择用户</option>';
			$.each(res.users || [], function(i, user) {
				html += '<option value="' + user.uid + '">' + user.currentName + ' (工号:' + user.userNo + ')</option>';
			});
			$('#userId').html(html);
			$('#userId').chosen({ allow_single_deselect: true });
		});
	}

	// 打开编辑对话框
	function openEditModal(qaurid) {
		$('#editForm')[0].reset();
		$('#qaurid').val('');
		$('input[name="supportType"]').prop('checked', false);

		if (qaurid) {
			$('#modalTitle').text('编辑预算员');

			// 查询详情
			com.post(api.quotation.getBudgetUserRule, {
				"qaurid": qaurid
			}, function(res) {
				var rule = res.budgetUserRule;
				$('#qaurid').val(rule.qaurid);
				$('#userId').val(rule.userId).trigger('chosen:updated');
				$('#maxTasks').val(rule.maxTasks || 5);

				// 加载支持类型
				com.post(api.quotation.getBudgetUserTypes, {
					"qaurid": qaurid
				}, function(typeRes) {
					$('input[name="supportType"]').each(function() {
						$(this).prop('checked', $.inArray(parseInt($(this).val()), typeRes.types || []) !== -1);
					});
				});
			});
		} else {
			$('#modalTitle').text('新增预算员');
		}

		$('#editModal').modal('show');
	}

	// 保存
	function save() {
		var qaurid = $('#qaurid').val();
		var userId = $('#userId').val();

		if (!userId) {
			com.showAlert(com.warning, '请选择用户');
			return false;
		}

		// 收集支持类型
		var types = [];
		$('input[name="supportType"]:checked').each(function() {
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
			"budgetUserRule.maxTasks": parseInt($('#maxTasks').val()) || 5,
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
					$('#editModal').modal('hide');
					loadList();
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
					loadList();
				} else {
					com.showAlert(com.error, res.message);
				}
			});
		});
	}

	// 启用/停用
	function toggleStatus(qaurid, enabled) {
		var apiMethod = enabled ? api.quotation.enableBudgetUser : api.quotation.disableBudgetUser;

		com.post(apiMethod, {
			"qaurid": qaurid
		}, function(res) {
			if (res.success) {
				com.showAlert(com.info, enabled ? '已启用' : '已停用');
				loadList();
			} else {
				com.showAlert(com.error, res.message);
			}
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
			$('#workloadModal').modal('show');
		});
	}

	// 事件绑定
	com.focusPage('#searchBtn').on('click', function() {
		page.pageNo = 1;
		loadList();
	});

	com.focusPage('#addBtn').on('click', function() {
		openEditModal(null);
	});

	com.focusPage('#refreshBtn').on('click', function() {
		loadList();
	});

	com.focusPage('#workloadBtn').on('click', showWorkload);

	com.focusPage('#dataBody').on('click', '.edit-btn', function() {
		openEditModal($(this).data('id'));
	});

	com.focusPage('#dataBody').on('click', '.delete-btn', function() {
		deleteRule($(this).data('id'));
	});

	com.focusPage('#dataBody').on('click', '.enable-btn', function() {
		toggleStatus($(this).data('id'), true);
	});

	com.focusPage('#dataBody').on('click', '.disable-btn', function() {
		toggleStatus($(this).data('id'), false);
	});

	com.focusPage('#saveBtn').on('click', save);

	com.focusPage('#pagination').on('click', 'a[data-page]', function() {
		var targetPage = parseInt($(this).data('page'));
		if (targetPage > 0 && targetPage <= Math.ceil(page.total / page.pageSize)) {
			page.pageNo = targetPage;
			loadList();
		}
		return false;
	});

	// 初始化
	loadUserOptions();
	loadList();
});
