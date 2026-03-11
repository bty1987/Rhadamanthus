$(function() {

	// ==================== 应用状态 ====================
	var app = {
		currentCompany: params.company.cid,  // 当前公司ID
		allConfigs: [],                       // 所有配置项
		groupedConfigs: {},                   // 按分组整理的配置
		editingScid: null,                    // 正在编辑的配置ID

		// UI元素引用
		ui: {
			statement: com.focusPage('#fl-statement'),
			companySelect: com.focusPage('#companySelect'),
			searchInput: com.focusPage('#searchInput'),
			addBtn: com.focusPage('#addConfigBtn'),
			refreshBtn: com.focusPage('#refreshBtn'),
			accordion: com.focusPage('#configAccordion'),
			modal: com.focusPage('#configModal'),
			modalTitle: com.focusPage('#modalTitle'),
			groupSelect: com.focusPage('#configGroup'),
			keyInput: com.focusPage('#configKey'),
			valueInput: com.focusPage('#configValue'),
			commentInput: com.focusPage('#configComment'),
			saveBtn: com.focusPage('#saveBtn'),
			cancelBtn: com.focusPage('#cancelBtn')
		}
	};

	// ==================== 分组名称映射 ====================
	var GROUP_NAMES = {
		'decoration': '装饰订单配置',
		'quotation': '报价管理配置',
		'construction': '施工管理配置',
		'customer': '客户管理配置',
		'payment': '支付管理配置',
		'personel': '人事管理配置',
		'sales': '主材销售配置',
		'dingtalk': '钉钉集成配置',
		'wechat': '微信集成配置',
		'seiya': '世雅集成配置',
		'default': '其他配置'
	};

	// ==================== 初始化 ====================
	function init() {
		// 设置页面标题
		app.ui.statement.statement(
			"公司级系统配置管理",
			"当前公司: " + params.company.name
		);

		// 加载公司列表
		loadCompanyList();

		// 设置当前公司
		app.ui.companySelect.val(app.currentCompany);

		// 加载配置
		loadConfigs();

		// 绑定事件
		bindEvents();
	}

	// ==================== 数据加载 ====================
	function loadCompanyList() {
		com.post(api.system.queryCompany, {}, function(res) {
			var html = '<option value="">请选择公司</option>';
			$.each(res.companys, function(i, company) {
				html += '<option value="' + company.cid + '">' + company.name + '</option>';
			});
			app.ui.companySelect.html(html);
		});
	}

	function loadConfigs() {
		if (!app.currentCompany) {
			app.ui.accordion.html('<div class="alert alert-info">请选择公司查看配置</div>');
			return;
		}

		com.showLoading('正在加载配置...');

		com.post(api.system.querySystemConfigByCid, {
			"systemConfig.company": app.currentCompany
		}, function(res) {
			app.allConfigs = res.systemConfigs || [];

			// 按分组整理
			groupConfigs();

			// 渲染界面
			renderAccordion();

			com.hideLoading();
		}, function(err) {
			com.hideLoading();
			com.showAlert(com.error, '加载配置失败: ' + (err.errorMsg || '未知错误'));
		});
	}

	// ==================== 数据处理 ====================
	function groupConfigs() {
		app.groupedConfigs = {};

		$.each(app.allConfigs, function(i, config) {
			var group = config.group || 'default';
			if (!app.groupedConfigs[group]) {
				app.groupedConfigs[group] = [];
			}
			app.groupedConfigs[group].push(config);
		});
	}

	function filterConfigs(keyword) {
		if (!keyword) return app.allConfigs;

		keyword = keyword.toLowerCase();
		return app.allConfigs.filter(function(config) {
			return (config.key && config.key.toLowerCase().indexOf(keyword) >= 0) ||
				   (config.comment && config.comment.toLowerCase().indexOf(keyword) >= 0) ||
				   (config.value && config.value.toLowerCase().indexOf(keyword) >= 0);
		});
	}

	// ==================== 渲染逻辑 ====================
	function renderAccordion() {
		var html = '';
		var groupIndex = 0;

		$.each(app.groupedConfigs, function(group, configs) {
			var groupName = GROUP_NAMES[group] || group;
			var collapseId = 'collapse_' + group.replace(/[^a-zA-Z0-9]/g, '_');
			var inClass = groupIndex === 0 ? 'in' : '';

			html += '<div class="panel panel-default">';
			html += '  <div class="panel-heading">';
			html += '    <h4 class="panel-title">';
			html += '      <a data-toggle="collapse" data-parent="#configAccordion" ';
			html += '         href="#' + collapseId + '">';
			html += '        <i class="icon-chevron-right"></i> ' + groupName;
			html += '        <span class="badge pull-right">' + configs.length + ' 项</span>';
			html += '      </a>';
			html += '    </h4>';
			html += '  </div>';
			html += '  <div id="' + collapseId + '" class="panel-collapse collapse ' + inClass + '">';
			html += '    <div class="panel-body no-padding">';
			html += '      <table class="table table-striped table-hover table-bordered">';
			html += '        <thead>';
			html += '          <tr>';
			html += '            <th width="25%">配置键</th>';
			html += '            <th width="35%">配置值</th>';
			html += '            <th width="20%">说明</th>';
			html += '            <th width="10%">创建人</th>';
			html += '            <th width="10%">操作</th>';
			html += '          </tr>';
			html += '        </thead>';
			html += '        <tbody>';

			$.each(configs, function(i, config) {
				html += '  <tr>';
				html += '    <td><code>' + escapeHtml(config.key || '') + '</code></td>';
				html += '    <td>' + escapeHtml(config.value || '') + '</td>';
				html += '    <td>' + escapeHtml(config.comment || '-') + '</td>';
				html += '    <td>' + (config.creater ? escapeHtml(config.creater.currentName) : '-') + '</td>';
				html += '    <td>';
				html += '      <button class="btn btn-xs btn-info edit-btn" data-scid="' + config.scid + '">编辑</button>';
				html += '    </td>';
				html += '  </tr>';
			});

			html += '        </tbody>';
			html += '      </table>';
			html += '    </div>';
			html += '  </div>';
			html += '</div>';

			groupIndex++;
		});

		// 如果没有配置
		if (Object.keys(app.groupedConfigs).length === 0) {
			html = '<div class="alert alert-warning" style="margin-top: 20px;">';
			html += '  <h4><i class="icon-warning-sign"></i> 暂无配置</h4>';
			html += '  <p>该公司暂无配置项，点击上方 <strong>新增配置</strong> 按钮添加配置。</p>';
			html += '</div>';
		}

		app.ui.accordion.html(html);
	}

	// HTML转义函数
	function escapeHtml(text) {
		if (!text) return '';
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	// ==================== 事件绑定 ====================
	function bindEvents() {
		// 公司切换
		app.ui.companySelect.on('change', function() {
			app.currentCompany = $(this).val();
			loadConfigs();
		});

		// 搜索（防抖）
		var searchTimeout;
		app.ui.searchInput.on('keyup', function() {
			clearTimeout(searchTimeout);
			var keyword = $(this).val();

			searchTimeout = setTimeout(function() {
				if (keyword) {
					var filtered = filterConfigs(keyword);
					app.allConfigs = filtered;
					groupConfigs();
					renderAccordion();
				} else {
					loadConfigs(); // 重新加载全部配置
				}
			}, 300);
		});

		// 刷新
		app.ui.refreshBtn.on('click', function() {
			app.ui.searchInput.val(''); // 清空搜索
			loadConfigs();
		});

		// 新增配置
		app.ui.addBtn.on('click', function() {
			showAddModal();
		});

		// 编辑按钮（事件委托）
		app.ui.accordion.on('click', '.edit-btn', function() {
			var scid = $(this).data('scid');
			editConfig(scid);
		});

		// 保存
		app.ui.saveBtn.on('click', function() {
			saveConfig();
		});

		// 取消
		app.ui.cancelBtn.on('click', function() {
			app.ui.modal.modal('hide');
		});
	}

	// ==================== 编辑逻辑 ====================
	function showAddModal() {
		app.editingScid = null;
		app.ui.modalTitle.text('新增配置');
		app.ui.groupSelect.val('');
		app.ui.keyInput.val('').prop('disabled', false);
		app.ui.valueInput.val('');
		app.ui.commentInput.val('');
		app.ui.modal.modal('show');
	}

	function editConfig(scid) {
		var config = app.allConfigs.find(function(c) { return c.scid == scid; });
		if (!config) return;

		app.editingScid = scid;
		app.ui.modalTitle.text('编辑配置');
		app.ui.groupSelect.val(config.group || '');
		app.ui.keyInput.val(config.key || '').prop('disabled', true); // key不可修改
		app.ui.valueInput.val(config.value || '');
		app.ui.commentInput.val(config.comment || '');
		app.ui.modal.modal('show');
	}

	function saveConfig() {
		// 验证
		if (!app.ui.groupSelect.val()) {
			com.showAlert(com.warning, '请选择分组');
			return;
		}
		if (!app.ui.keyInput.val()) {
			com.showAlert(com.warning, '请输入配置键');
			return;
		}
		if (!app.ui.valueInput.val()) {
			com.showAlert(com.warning, '请输入配置值');
			return;
		}

		// 配置键格式验证（只允许字母、数字、下划线）
		var keyPattern = /^[a-zA-Z0-9_]+$/;
		if (!keyPattern.test(app.ui.keyInput.val())) {
			com.showAlert(com.warning, '配置键只能包含字母、数字、下划线');
			return;
		}

		var options = {
			"systemConfig.company": app.currentCompany,
			"systemConfig.group": app.ui.groupSelect.val(),
			"systemConfig.key": app.ui.keyInput.val(),
			"systemConfig.value": app.ui.valueInput.val(),
			"systemConfig.comment": app.ui.commentInput.val()
		};

		// 编辑时传入scid
		if (app.editingScid) {
			options["systemConfig.scid"] = app.editingScid;
		}

		var apiUrl = app.editingScid ?
			api.system.updateSystemConfig :
			api.system.addSystemConfig;

		com.showLoading('正在保存...');

		com.post(apiUrl, options, function(res) {
			com.hideLoading();
			com.showAlert(com.info, '保存成功');
			app.ui.modal.modal('hide');
			loadConfigs(); // 重新加载
		}, function(err) {
			com.hideLoading();
			com.showAlert(com.error, '保存失败: ' + (err.errorMsg || '未知错误'));
		});
	}

	// ==================== 启动 ====================
	init();
});
