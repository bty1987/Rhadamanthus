$(function() {

	// ==================== 页面元素声明 ====================
	var config = {
		modals: {
			userRuleModal: com.focusPage('#userRuleModal')
		},
		items: {
			qaurid: com.focusPage('#qaurid'),
			user: com.focusPage('#user'),
			company: com.focusPage('#company'),
			department: com.focusPage('#department'),
			status: com.focusPage('#status'),
			supportedType: com.focusPage('input[name="supportedType"]')
		},
		btns: {
			addBtn: null, // 动态创建
			saveBtn: com.focusPage('#saveBtn')
		},
		plugins: {
			userTypeahead: null
		},
		lists: {},
		status: {
			isNew: true
		},
		data: {
			keyword: null,
			currentRow: null,
			selectedUid: null
		}
	};

	// 初始化 Searcher
	var searcher = new Searcher();

	// 基础配置
	searcher.base(
		"condList",                                   // 条件容器
		"pagenation",                                 // 分页容器
		"resultList",                                 // 结果容器
		api.quotation.pageQuotationAssignUserRule     // API 接口
	);

	// 查询条件
	searcher.condition([
		"assign-user-rule-company",
		"assign-user-rule-status",
		"assign-user-rule-userName"
	]);

	// 顶部按钮
	searcher.button(function() {
		var $addBtn = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left')
			.attr('id', 'addUserRuleBtn')
			.css('margin', '0px 3px');

		$('<i></i>').addClass('icon-plus bigger-110').appendTo($addBtn);
		$('<span></span>').text('新增').appendTo($addBtn);

		config.btns.addBtn = $addBtn; // 缓存按钮引用

		return [$addBtn];
	});

	// 列表行配置
	var lineprops = [{
		field: "qaurid",
		name: "多选",
		type: "checkbox",
		prop: "qaurid"
	}, {
		field: "user",
		name: "预算员",
		prop: "user.currentName",
		clazz: "blue"
	}, {
		field: "company",
		name: "公司",
		prop: "company.name",
		clazz: "grey"
	}, {
		field: "department",
		name: "部门",
		prop: function(v) {
			// 部门ID为NULL表示该公司所有部门
			return v.department ? (v.departmentVO ? v.departmentVO.name : "未知部门") : "所有部门";
		},
		clazz: "grey"
	}, {
		field: "status",
		name: "状态",
		prop: function(v) {
			// 使用 constant 进行枚举转换
			return constant.quotation().quotationAssignUserRule.status.keys[v.status];
		},
		clazz: "red"  // 类型/状态使用 red
	}, {
		field: "supportedType",
		name: "支持类型",
		prop: function(v) {
			// 使用 constant 进行枚举转换
			var type = v.supportedType;
			return constant.quotation().quotationAssignUserRule.supportedType.keys[type] || "未设置";
		},
		clazz: "red"  // 类型/状态使用 red
	}, {
		field: "currentTaskCount",
		name: "当前任务",
		prop: function(v) {
			return v.currentTaskCount || 0;
		},
		clazz: "blue"  // 数值类型使用 blue
	}, {
		field: "lastFinishTime",
		name: "最后完成时间",
		prop: "lastFinishTime",
		clazz: "green"  // 时间类型使用 green
	}, {
		field: "createTime",
		name: "创建时间",
		prop: "createTime",
		clazz: "green"  // 时间类型使用 green
	}];

	// 行按钮
	var linebtns = [{
		name: "编辑",
		clazz: "btn-yellow",
		handle: function(v) {
			editUserRule(v);
			return false;
		}
	}, {
		name: "删除",
		clazz: "btn-danger",
		handle: function(v) {
			deleteUserRule(v);
			return false;
		}
	}, {
		// 启用按钮：仅在状态不为1（可用）时显示
		name: "启用",
		clazz: "btn-success",
		handle: function(v) {
			enableUserRule(v);
			return false;
		},
		show: function(v){
			return v.status != 1;
		}
	}, {
		// 禁用按钮：仅在状态为1（可用）时显示
		name: "禁用",
		clazz: "btn-grey",
		handle: function(v) {
			disableUserRule(v);
			return false;
		},
		show: function(v){
			return v.status == 1;
		}
	}];

	// 配置行
	searcher.line("user.currentName", lineprops, linebtns);

	// 渲染列表
	searcher.render();

	// ==================== Modal 表单操作 ====================

	// 初始化下拉框
	function initSelectOptions() {
		// 状态下拉框
		config.items.status.bindData(
			constant.quotation().quotationAssignUserRule.status.datas,
			"key",   // value: 1, 2, 3
			"value"  // text: 可用, 制作中, 停止
		);
	}

	// 初始化公司下拉框
	function initCompanySelect() {
		com.post(api.system.queryCompany, {}, function(res) {
			config.items.company.bindData(res.companys, "cid", "name", false);
		}, null, false);
	}

	// 初始化部门下拉框（公司选择后加载）
	function initDepartmentSelect(companyId) {
		console.log('initDepartmentSelect called with companyId:', companyId);

		if (!companyId) {
			config.items.department.empty().append('<option value="">全部部门</option>');
			return;
		}

		// 使用正确的接口：api.communion.queryDepartment
		com.post(api.communion.queryDepartment, {
			"department.company.cid": companyId
		}, function(res) {
			console.log('queryDepartment response:', res);
			console.log('deptList:', res.deptList);

			if (res.deptList && res.deptList.length > 0) {
				config.items.department.bindData(res.deptList, "did", "name", true);
			} else {
				config.items.department.empty().append('<option value="">无部门数据</option>');
			}
		}, null, false);
	}

	// 初始化预算员输入框（typeahead）
	function initUserInput() {
		com.initTypeahead(
			config.items.user,                           // 容器元素
			api.personel.queryUserByPinyin,             // 请求地址
			"pinyinName",                               // 参数名称（后端Action接收的字段名）
			{ "user.status": 0 },                       // 额外参数：仅在职员工（0=在职）
			"autoFillKeyValue",                         // 返回结果路径
			"key",                                      // key路径
			"value",                                    // value路径
			function(list, key, value) {                 // 选中回调
				// typeahead 组件会自动设置 data-typeahead-key 和 data-typeahead-value
				// key 就是 uid，value 就是显示名称
				console.log('Selected user - key(uid):', key, 'value(name):', value);
				return value;  // 返回显示值
			}
		);
	}

	// 页面加载时初始化
	initSelectOptions();
	initCompanySelect();
	initUserInput();

	// 监听公司变化，联动部门
	config.items.company.on('change', function() {
		var companyId = $(this).val();
		initDepartmentSelect(companyId);
	});

	// 点击新增按钮
	$(document).on('click', '#addUserRuleBtn', function() {
		resetForm();
		config.status.isNew = true;
		com.focusPage('#modalTitle').text('新增预算员规则');
		config.modals.userRuleModal.modal('show');
	});

	// 重置表单
	function resetForm() {
		config.items.qaurid.val('');
		// 使用 com.cleanTypeahead 清除 typeahead 的值和属性
		com.cleanTypeahead(config.items.user);
		config.data.selectedUid = null;
		config.items.user.prop('disabled', false);  // 启用预算员输入框（新增模式）
		config.items.company.val('');
		config.items.department.empty().append('<option value="">全部部门</option>');
		config.items.status.val('1');  // 默认可用
		config.items.supportedType.filter('[value="-1"]').prop('checked', true);  // 默认通用
	}

	// 编辑配置
	function editUserRule(row) {
		// 先重置表单
		resetForm();

		// 保存当前行数据
		config.data.currentRow = row;
		config.status.isNew = false;

		// 填充表单数据
		config.items.qaurid.val(row.qaurid);
		config.items.user.val(row.user.currentName);
		// 使用 typeahead 的 data 属性保存 uid
		config.items.user.attr('data-typeahead-key', row.user.uid);
		config.items.user.attr('data-typeahead-value', row.user.currentName);
		config.data.selectedUid = row.user.uid;  // 保留兼容性
		config.items.user.prop('disabled', true);  // 禁用预算员输入框（编辑模式不可修改人员）
		config.items.company.val(row.company.cid);

		// 初始化部门并选中
		initDepartmentSelect(row.company.cid);
		if (row.department) {
			setTimeout(function() {
				config.items.department.val(row.department.did);
			}, 100);
		}

		config.items.status.val(row.status);

		// 设置支持类型选中
		if (row.supportedType !== undefined && row.supportedType !== null) {
			config.items.supportedType.filter('[value="' + row.supportedType + '"]').prop('checked', true);
		} else {
			config.items.supportedType.filter('[value="-1"]').prop('checked', true);  // 默认通用
		}

		com.focusPage('#modalTitle').text('编辑预算员规则');
		config.modals.userRuleModal.modal('show');
	}

	// 保存配置
	function saveUserRule() {
		// 表单验证
		if (com.validate('userRuleModal')) {
			return false;
		}

		var qaurid = config.items.qaurid.val();
		var isNew = !qaurid;

		// 使用 com.typeahead 方法获取选中的 uid
		// 第三个参数 false 表示获取 key（即 uid）
		var uid = com.typeahead(config.items.user, null, false);

		// 验证是否选择了用户
		if (!uid) {
			com.showAlert(com.warning, '请选择预算员');
			return false;
		}

		var params = {
			"quotationAssignUserRule.qaurid": qaurid,
			"quotationAssignUserRule.user.userId": uid,
			"quotationAssignUserRule.company.cid": config.items.company.val(),
			"quotationAssignUserRule.department.did": config.items.department.val() || null,
			"quotationAssignUserRule.status": parseInt(config.items.status.val()),
			"quotationAssignUserRule.supportedType": parseInt(config.items.supportedType.filter(':checked').val())
		};

		var apiMethod = isNew
			? api.quotation.createQuotationAssignUserRule
			: api.quotation.updateQuotationAssignUserRule;

		com.post(apiMethod, params, function(res) {
			com.showAlert(com.info, isNew ? '新增成功' : '更新成功');
			config.modals.userRuleModal.modal('hide');
			searcher.doSearch(); // 刷新列表
		});
	}

	// 删除配置
	function deleteUserRule(row) {
		com.showConfirm('确认删除该预算员规则吗？', function() {
			com.post(api.quotation.deleteQuotationAssignUserRule, {
				"quotationAssignUserRule.qaurid": row.qaurid
			}, function(res) {
				com.showAlert(com.info, '删除成功');
				searcher.doSearch(); // 刷新列表
			});
		});
	}

	// 快捷启用预算员
	function enableUserRule(row) {
		com.showConfirm('确认要启用该预算员吗？', function() {
			com.post(api.quotation.updateQuotationAssignUserRuleForStatus, {
				"quotationAssignUserRule.qaurid": row.qaurid,
				"quotationAssignUserRule.status": 1  // 1-可用
			}, function(res) {
				com.showAlert(com.info, '启用成功');
				searcher.doSearch(); // 刷新列表
			});
		});
	}

	// 快捷禁用预算员
	function disableUserRule(row) {
		com.showConfirm('确认要禁用该预算员吗？', function() {
			com.post(api.quotation.updateQuotationAssignUserRuleForStatus, {
				"quotationAssignUserRule.qaurid": row.qaurid,
				"quotationAssignUserRule.status": 3  // 3-停止
			}, function(res) {
				com.showAlert(com.info, '禁用成功');
				searcher.doSearch(); // 刷新列表
			});
		});
	}

	// 绑定保存按钮事件
	config.btns.saveBtn.on('click', saveUserRule);

})
