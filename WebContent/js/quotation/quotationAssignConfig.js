/**
 * 预算配置管理
 * 管理报价单预算员自动分配功能的配置
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
		com.post(api.quotationAssign.getQuotationConfigsByCompany, {
			"company": $('#companySelect').val() || params.userInfo.company.cid
		}, function(res) {
			renderList(res.quotationConfigs || []);
		});
	}

	// 渲染列表
	function renderList(list) {
		var html = '';

		if (list.length === 0) {
			html = '<tr><td colspan="7" class="text-center">暂无配置，点击"新增配置"创建</td></tr>';
		} else {
			$.each(list, function(i, item) {
				var enabledMap = {
					1: '<span class="label label-success">已启用</span>',
					0: '<span class="label label-default">已禁用</span>'
				};

				var autoAssignMap = {
					1: '<span class="label label-info">自动分配</span>',
					0: '<span class="label label-warning">手动分配</span>'
				};

				html += '<tr>';
				html += '<td>' + (item.companyName || '-') + '</td>';
				html += '<td>' + (item.departmentName || '全公司') + '</td>';
				html += '<td>' + (enabledMap[item.enabled] || '-') + '</td>';
				html += '<td>' + (autoAssignMap[item.autoAssign] || '-') + '</td>';
				html += '<td>' + com.formatDate(item.createTime, 'yyyy-MM-dd HH:mm') + '</td>';
				html += '<td>' + com.formatDate(item.updateTime, 'yyyy-MM-dd HH:mm') + '</td>';
				html += '<td>';
				html += '  <button class="btn btn-xs btn-info edit-btn" data-id="' + item.qcid + '"><i class="icon-edit"></i> 编辑</button> ';
				html += '  <button class="btn btn-xs btn-success toggle-btn" data-id="' + item.qcid + '" data-enabled="' + item.enabled + '">';
				html += item.enabled == 1 ? '<i class="icon-ban-circle"></i> 禁用' : '<i class="icon-ok"></i> 启用';
				html += '</button> ';
				html += '  <button class="btn btn-xs btn-danger delete-btn" data-id="' + item.qcid + '"><i class="icon-trash"></i> 删除</button>';
				html += '</td>';
				html += '</tr>';
			});
		}

		com.focusPage('#dataBody').html(html);
	}

	// 加载公司选项
	function loadCompanyOptions() {
		com.post(api.system.queryCompanyForOption, {}, function(res) {
			var html = '<option value="">全部</option>';
			$.each(res.companies || [], function(i, company) {
				html += '<option value="' + company.cid + '">' + company.name + '</option>';
			});
			$('#companySelect').html(html);
			$('#companyId').html('<option value="">请选择公司</option>' + html);
			$('#companyId').chosen({ allow_single_deselect: true });

			// 自动选择当前用户的公司
			if (params.userInfo && params.userInfo.company) {
				$('#companyId').val(params.userInfo.company.cid).trigger('chosen:updated');
			}
		});
	}

	// 加载部门选项
	function loadDepartmentOptions(companyId) {
		if (!companyId) {
			$('#departmentId').html('<option value="">请选择部门（可选）</option>').trigger('chosen:updated');
			return;
		}

		com.post(api.system.queryDepartmentByCompany, {
			"company": companyId
		}, function(res) {
			var html = '<option value="">请选择部门（可选）</option>';
			$.each(res.departments || [], function(i, dept) {
				html += '<option value="' + dept.did + '">' + dept.name + '</option>';
			});
			$('#departmentId').html(html);
			$('#departmentId').chosen({ allow_single_deselect: true });
		});
	}

	// 打开编辑对话框
	function openEditModal(qcid) {
		$('#editForm')[0].reset();
		$('#qcid').val('');
		$('input[name="enabled"][value="1"]').prop('checked', true);
		$('input[name="autoAssign"][value="1"]').prop('checked', true);

		if (qcid) {
			$('#modalTitle').text('编辑预算配置');

			com.post(api.quotationAssign.getQuotationConfig, {
				"qcid": qcid
			}, function(res) {
				var config = res.quotationConfig;
				$('#qcid').val(config.qcid);
				$('#companyId').val(config.company).trigger('chosen:updated');
				loadDepartmentOptions(config.company);

				setTimeout(function() {
					if (config.department) {
						$('#departmentId').val(config.department).trigger('chosen:updated');
					}
					$('input[name="enabled"][value="' + config.enabled + '"]').prop('checked', true);
					$('input[name="autoAssign"][value="' + config.autoAssign + '"]').prop('checked', true);
				}, 200);
			});
		} else {
			$('#modalTitle').text('新增预算配置');
		}

		$('#editModal').modal('show');
	}

	// 保存
	function save() {
		var qcid = $('#qcid').val();
		var company = $('#companyId').val();
		var department = $('#departmentId').val();
		var enabled = parseInt($('input[name="enabled"]:checked').val());
		var autoAssign = parseInt($('input[name="autoAssign"]:checked').val());

		if (!company) {
			com.showAlert(com.warning, '请选择公司');
			return false;
		}

		var params = {
			"quotationConfig.qcid": qcid || null,
			"quotationConfig.company": company,
			"quotationConfig.department": department || null,
			"quotationConfig.enabled": enabled,
			"quotationConfig.autoAssign": autoAssign
		};

		var apiMethod = qcid ? api.quotationAssign.updateQuotationConfig : api.quotationAssign.saveQuotationConfig;

		com.post(apiMethod, params, function(res) {
			if (res.success) {
				com.showAlert(com.info, '保存成功');
				$('#editModal').modal('hide');
				loadList();
			} else {
				com.showAlert(com.error, res.message);
			}
		});
	}

	// 删除
	function deleteConfig(qcid) {
		com.showConfirm('确认删除该配置？', function() {
			com.post(api.quotationAssign.deleteQuotationConfig, {
				"qcid": qcid
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

	// 切换启用状态
	function toggleEnabled(qcid, currentEnabled) {
		var apiMethod = currentEnabled == 1 ? api.quotationAssign.disableQuotationAssign : api.quotationAssign.enableQuotationAssign;
		var actionText = currentEnabled == 1 ? '禁用' : '启用';

		com.showConfirm('确认' + actionText + '该配置？', function() {
			com.post(apiMethod, {
				"company": null,  // 从配置中获取
				"department": null,
				"qcid": qcid
			}, function(res) {
				if (res.success) {
					com.showAlert(com.info, res.message || actionText + '成功');
					loadList();
				} else {
					com.showAlert(com.error, res.message);
				}
			});
		});
	}

	// 事件绑定
	com.focusPage('#searchBtn').on('click', function() {
		loadList();
	});

	com.focusPage('#addBtn').on('click', function() {
		openEditModal(null);
	});

	com.focusPage('#refreshBtn').on('click', function() {
		loadList();
	});

	com.focusPage('#companyId').on('change', function() {
		loadDepartmentOptions($(this).val());
	});

	com.focusPage('#dataBody').on('click', '.edit-btn', function() {
		openEditModal($(this).data('id'));
	});

	com.focusPage('#dataBody').on('click', '.delete-btn', function() {
		deleteConfig($(this).data('id'));
	});

	com.focusPage('#dataBody').on('click', '.toggle-btn', function() {
		var $btn = $(this);
		toggleEnabled($btn.data('id'), $btn.data('enabled'));
	});

	com.focusPage('#saveBtn').on('click', save);

	// 初始化
	loadCompanyOptions();
	loadList();
});
