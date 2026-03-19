/**
 * 预算配置管理 - 使用 Searcher 组件
 * 管理报价单预算员自动分配功能的配置
 */
jQuery(function($) {

	// 加载公司选项（用于编辑对话框）
	function loadCompanyOptions() {
		com.post(api.system.queryCompany, {}, function(res) {
			var html = '<option value="">请选择公司</option>';
			$.each(res.companys || [], function(i, company) {
				html += '<option value="' + company.cid + '">' + company.name + '</option>';
			});
			com.focusPage('#companyId').html(html);
			// chosen-select 类会自动初始化，只需更新即可
			com.focusPage('#companyId').trigger('chosen:updated');

			// 自动选择当前用户的公司
			if (params.userInfo && params.userInfo.company) {
				com.focusPage('#companyId').val(params.userInfo.company.cid).trigger('chosen:updated');
			}
		});
	}

	// 加载部门选项（使用 communion 模块的部门接口）
	function loadDepartmentOptions(companyId) {
		if (!companyId) {
			com.focusPage('#departmentId').html('<option value="">请选择部门（可选）</option>').trigger('chosen:updated');
			return;
		}

		com.post(api.communion.queryDepartment, {
			"dept": {},
			"company": companyId
		}, function(res) {
			var html = '<option value="">请选择部门（可选）</option>';
			$.each(res.deptList || [], function(i, dept) {
				html += '<option value="' + dept.did + '">' + dept.name + '</option>';
			});
			com.focusPage('#departmentId').html(html);
			// chosen-select 类会自动初始化，只需更新即可
			com.focusPage('#departmentId').trigger('chosen:updated');
		});
	}

	// 打开编辑对话框
	function openEditModal(qacid) {
		com.focusPage('#editForm')[0].reset();
		com.focusPage('#qacid').val('');
		com.focusPage('input[name="enabled"][value="1"]').prop('checked', true);
		com.focusPage('input[name="autoAssign"][value="1"]').prop('checked', true);

		if (qacid) {
			com.focusPage('#modalTitle').text('编辑预算配置');

			com.post(api.quotation.queryQuotationAssignConfig, {
				"quotationAssignConfig.qacid": qacid
			}, function(res) {
				var config = res.quotationAssignConfig;
				com.focusPage('#qacid').val(config.qacid);
				com.focusPage('#companyId').val(config.company).trigger('chosen:updated');
				loadDepartmentOptions(config.company);

				setTimeout(function() {
					if (config.department) {
						com.focusPage('#departmentId').val(config.department).trigger('chosen:updated');
					}
					com.focusPage('input[name="enabled"][value="' + config.enabled + '"]').prop('checked', true);
					com.focusPage('input[name="autoAssign"][value="' + config.autoAssign + '"]').prop('checked', true);
				}, 200);
			});
		} else {
			com.focusPage('#modalTitle').text('新增预算配置');
		}

		com.focusPage('#editModal').modal('show');
	}

	// 保存
	function save() {
		var qacid = com.focusPage('#qacid').val();
		var company = com.focusPage('#companyId').val();
		var department = com.focusPage('#departmentId').val();
		var enabled = parseInt(com.focusPage('input[name="enabled"]:checked').val());
		var autoAssign = parseInt(com.focusPage('input[name="autoAssign"]:checked').val());

		if (!company) {
			com.showAlert(com.warning, '请选择公司');
			return false;
		}

		var params = {
			"quotationAssignConfig.qacid": qacid || null,
			"quotationAssignConfig.company": company,
			"quotationAssignConfig.department": department || null,
			"quotationAssignConfig.enabled": enabled,
			"quotationAssignConfig.autoAssign": autoAssign
		};

		var apiMethod = api.quotation.saveQuotationAssignConfig;

		com.post(apiMethod, params, function(res) {
			if (res.success) {
				com.showAlert(com.info, '保存成功');
				com.focusPage('#editModal').modal('hide');
				searcher.doSearch();
			} else {
				com.showAlert(com.error, res.message);
			}
		});
	}

	// 删除
	function deleteConfig(qacid) {
		com.showConfirm('确认删除该配置？', function() {
			com.post(api.quotation.deleteQuotationAssignConfig, {
				"quotationAssignConfig.qacid": qacid
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

	// 切换启用状态
	function toggleEnabled(qacid, currentEnabled) {
		var apiMethod = currentEnabled == 1 ? api.quotation.disableQuotationAssignConfig : api.quotation.enableQuotationAssignConfig;
		var actionText = currentEnabled == 1 ? '禁用' : '启用';

		com.showConfirm('确认' + actionText + '该配置？', function() {
			com.post(apiMethod, {
				"quotationAssignConfig.qacid": qacid
			}, function(res) {
				if (res.success) {
					com.showAlert(com.info, res.message || actionText + '成功');
					searcher.doSearch();
				} else {
					com.showAlert(com.error, res.message);
				}
			});
		});
	}

	// 创建 Searcher 实例
	var searcher = new Searcher();

	// 设置基础配置
	searcher.base(
		"condList",                                    // 查询条件容器ID
		"pagenation",                                  // 分页容器ID
		"resultList",                                  // 结果容器ID
		api.quotation.getQuotationConfigsByCompany    // API接口
	);

	// 设置结果数据名称
	searcher.result("quotationConfigs");

	// 设置查询条件
	searcher.condition([
		"quotation-assignConfig-company",
		"quotation-assignConfig-enabled",
		"quotation-assignConfig-autoAssign"
	]);

	// 设置工具按钮
	searcher.button(function() {
		var $addBtn = $('<a></a>')
			.addClass('btn btn-minier btn-success pull-left')
			.attr('id', 'addConfigBtn')
			.css('margin', '0px 3px');
		$('<i></i>').addClass('icon-plus bigger-110').appendTo($addBtn);
		$('<span></span>').text('新增配置').appendTo($addBtn);

		return [$addBtn];
	});

	// 定义列表列配置
	var lineprops = [{
		field: "qacid",
		name: "多选",
		type: "checkbox",
		prop: "qacid"
	}, {
		field: "companyName",
		name: "公司",
		prop: "companyName",
		clazz: "blue"
	}, {
		field: "departmentName",
		name: "部门",
		prop: function(v) {
			return v.departmentName || '<span class="grey">全公司</span>';
		},
		clazz: "grey"
	}, {
		field: "enabled",
		name: "启用状态",
		prop: function(v) {
			return v.enabled == 1
				? '<span class="label label-success">已启用</span>'
				: '<span class="label label-default">已禁用</span>';
		}
	}, {
		field: "autoAssign",
		name: "分配方式",
		prop: function(v) {
			return v.autoAssign == 1
				? '<span class="label label-info">自动分配</span>'
				: '<span class="label label-warning">手动分配</span>';
		}
	}, {
		field: "createTime",
		name: "创建时间",
		prop: function(v) {
			return com.formatDate(v.createTime, 'yyyy-MM-dd HH:mm');
		},
		clazz: "grey"
	}, {
		field: "updateTime",
		name: "更新时间",
		prop: function(v) {
			return com.formatDate(v.updateTime, 'yyyy-MM-dd HH:mm');
		},
		clazz: "grey"
	}];

	// 定义行操作按钮
	var linebtns = {
		'edit': {
			name: "编辑",
			clazz: "btn-info",
			handle: function(v) {
				openEditModal(v.qacid);
			}
		},
		'toggle': {
			name: function(v) {
				return v.enabled == 1 ? '禁用' : '启用';
			},
			clazz: function(v) {
				return v.enabled == 1 ? 'btn-warning' : 'btn-success';
			},
			handle: function(v) {
				toggleEnabled(v.qacid, v.enabled);
			}
		},
		'delete': {
			name: "删除",
			clazz: "btn-danger",
			handle: function(v) {
				deleteConfig(v.qacid);
			}
		}
	};

	// 设置为不分页模式，使用现有接口
	searcher.isPage(true);

	// 渲染列表
	searcher.line("companyName", lineprops, linebtns).render();

	// 绑定新增按钮事件
	com.focusPage('#addConfigBtn', '#pagenation').on('click', function() {
		openEditModal(null);
	});

	// 绑定保存按钮事件
	com.focusPage('#saveBtn').on('click', save);

	// 绑定公司选择变更事件
	com.focusPage('#companyId').on('change', function() {
		loadDepartmentOptions($(this).val());
	});

	// 初始化加载公司选项
	loadCompanyOptions();
});
