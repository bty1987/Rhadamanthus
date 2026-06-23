$(function() {

	// ==================== 应用状态 ====================
	var app = {
		dbConfigMap: {},                      // key -> DB 配置记录(已落库的)
		mergedConfigs: [],                    // catalog 与 DB 合并后的完整配置列表
		groupedConfigs: {},                   // 按分组整理的配置
		editingKey: null,                     // 正在编辑的配置键(catalog key)
		editingConfig: null,                  // 当前编辑的 catalog 项元数据

		ui: {
			statement: com.focusPage('#fl-statement'),
			searchInput: com.focusPage('#searchInput'),
			addBtn: com.focusPage('#addConfigBtn'),
			refreshBtn: com.focusPage('#refreshBtn'),
			accordion: com.focusPage('#configAccordion'),
			modal: com.focusPage('#configModal'),
			modalTitle: com.focusPage('#modalTitle'),
			groupSelect: com.focusPage('#configGroup'),
			keyInput: com.focusPage('#configKey'),
			keyDisplay: com.focusPage('#configKeyDisplay'),
			nameInput: com.focusPage('#configName'),
			descBox: com.focusPage('#configDesc'),
			valueInput: com.focusPage('#configValue'),
			commentInput: com.focusPage('#configComment'),
			saveBtn: com.focusPage('#saveBtn'),
			cancelBtn: com.focusPage('#cancelBtn'),
			deleteBtn: com.focusPage('#deleteBtn')
		}
	};

	var CATALOG = window.SYSTEM_CONFIG_CATALOG || [];
	var GROUPS = window.SYSTEM_CONFIG_GROUPS || {};

	// ==================== 初始化 ====================
	function init() {

		app.ui.statement.statement(
			"公司级系统配置管理",
			"当前公司: " + params.company.name + " — 可在此查看并维护全部可配置项"
		);

		// 分组下拉填充(来源于目录分组定义)
		renderGroupOptions();

		bindEvents();
		loadConfigs();
	}

	// ==================== 数据加载 ====================
	function loadConfigs() {

		com.showLoading('正在加载配置...');

		com.post(api.system.querySystemConfigByCid, {}, function(res) {
			// 建立 key -> DB 配置 映射
			app.dbConfigMap = {};
			$.each(res.systemConfigs || [], function(i, config) {
				if (config.key) app.dbConfigMap[config.key] = config;
			});

			// 合并 catalog 与 DB 记录
			mergeConfigs();
			groupConfigs();
			renderAccordion();

			com.hideLoading();
		}, function(err) {
			com.hideLoading();
			com.showAlert(com.error, '加载配置失败: ' + (err.errorMsg || '未知错误'));
		});
	}

	// 将目录与 DB 记录合并: 目录中每项,若 DB 已有则标注 configured=true 并带入实际值/scid/creater
	function mergeConfigs() {
		app.mergedConfigs = [];

		$.each(CATALOG, function(i, meta) {
			var db = app.dbConfigMap[meta.key];
			var item = $.extend({}, meta);

			if (db) {
				item.configured = true;
				item.value = db.value;
				item.comment = db.comment;
				item.scid = db.scid;
				item.creater = db.creater;
			} else {
				item.configured = false;
				item.value = null;       // 实际值不存在
				item.displayValue = meta.defaultValue; // 占位用默认值
			}

			app.mergedConfigs.push(item);
		});

		// DB 中存在但不在目录里的"自定义"配置项,归入其他分组
		$.each(app.dbConfigMap, function(key, db) {
			var inCatalog = false;
			for (var i = 0; i < CATALOG.length; i++) {
				if (CATALOG[i].key === key) { inCatalog = true; break; }
			}
			if (!inCatalog) {
				app.mergedConfigs.push({
					key: key,
					group: db.group || 'default',
					name: db.comment || key,
					desc: '自定义配置项(不在标准目录中)',
					type: 'string',
					defaultValue: '',
					configured: true,
					value: db.value,
					comment: db.comment,
					scid: db.scid,
					creater: db.creater
				});
			}
		});
	}

	function groupConfigs() {
		app.groupedConfigs = {};

		$.each(app.mergedConfigs, function(i, config) {
			var group = config.group || 'default';
			if (!app.groupedConfigs[group]) app.groupedConfigs[group] = [];
			app.groupedConfigs[group].push(config);
		});
	}

	function filterConfigs(keyword) {
		if (!keyword) return app.mergedConfigs;

		keyword = keyword.toLowerCase();
		return app.mergedConfigs.filter(function(c) {
			return (c.key && c.key.toLowerCase().indexOf(keyword) >= 0) ||
				   (c.name && c.name.toLowerCase().indexOf(keyword) >= 0) ||
				   (c.desc && c.desc.toLowerCase().indexOf(keyword) >= 0) ||
				   (c.comment && c.comment.toLowerCase().indexOf(keyword) >= 0) ||
				   (c.value && String(c.value).toLowerCase().indexOf(keyword) >= 0);
		});
	}

	// ==================== 渲染逻辑 ====================
	function renderGroupOptions() {
		var html = '<option value="">请选择分组</option>';
		var sortedGroups = Object.keys(GROUPS).sort(function(a, b) {
			return (GROUPS[a].order || 99) - (GROUPS[b].order || 99);
		});
		$.each(sortedGroups, function(i, code) {
			html += '<option value="' + code + '">' + GROUPS[code].name + '</option>';
		});
		app.ui.groupSelect.html(html);
	}

	function renderAccordion(optionalConfigs) {
		var configsSource = optionalConfigs || app.mergedConfigs;

		// 重新按分组组织(支持搜索过滤后的子集)
		var grouped = {};
		$.each(configsSource, function(i, config) {
			var group = config.group || 'default';
			if (!grouped[group]) grouped[group] = [];
			grouped[group].push(config);
		});

		var html = '';
		var groupOrder = Object.keys(grouped).sort(function(a, b) {
			return (GROUPS[a] && GROUPS[a].order || 99) - (GROUPS[b] && GROUPS[b].order || 99);
		});

		var groupIndex = 0;
		$.each(groupOrder, function(idx, group) {
			var configs = grouped[group];
			var groupName = (GROUPS[group] && GROUPS[group].name) || group;
			var collapseId = 'collapse_' + group.replace(/[^a-zA-Z0-9]/g, '_');
			var inClass = groupIndex === 0 ? 'in' : '';

			var configuredCount = configs.filter(function(c) { return c.configured; }).length;

			html += '<div class="panel panel-default">';
			html += '  <div class="panel-heading">';
			html += '    <h4 class="panel-title">';
			html += '      <a data-toggle="collapse" data-parent="#configAccordion" ';
			html += '         href="#' + collapseId + '">';
			html += '        <i class="icon-chevron-right"></i> ' + escapeHtml(groupName);
			html += '        <span class="badge pull-right">' + configuredCount + '/' + configs.length + ' 项已配置</span>';
			html += '      </a>';
			html += '    </h4>';
			html += '  </div>';
			html += '  <div id="' + collapseId + '" class="panel-collapse collapse ' + inClass + '">';
			html += '    <div class="panel-body no-padding">';
			html += '      <table class="table table-striped table-hover table-bordered">';
			html += '        <thead>';
			html += '          <tr>';
			html += '            <th width="22%">配置项</th>';
			html += '            <th width="20%">配置键</th>';
			html += '            <th width="26%">当前值</th>';
			html += '            <th width="20%">说明</th>';
			html += '            <th width="12%">操作</th>';
			html += '          </tr>';
			html += '        </thead>';
			html += '        <tbody>';

			$.each(configs, function(i, config) {
				var keyAttr = ' data-key="' + escapeHtml(config.key) + '"';
				var valueCell, actionBtn;

				if (config.configured) {
					// 已配置: 蓝色显示实际值
					valueCell = '<span style="color:#3071a9;word-break:break-all;">' + escapeHtml(config.value || '(空)') + '</span>';
					actionBtn = '<button class="btn btn-xs btn-info edit-btn"' + keyAttr + '>编辑</button> ';
					actionBtn += '<button class="btn btn-xs btn-danger delete-btn"' + keyAttr + '>删除</button>';
				} else {
					// 未配置: 灰色显示默认值占位
					var defVal = config.defaultValue ? escapeHtml(config.defaultValue) : '<em>无默认值</em>';
					valueCell = '<span class="text-muted" style="word-break:break-all;">默认: ' + defVal + ' <span class="label label-default">未配置</span></span>';
					actionBtn = '<button class="btn btn-xs btn-success set-btn"' + keyAttr + '>设置值</button>';
				}

				html += '  <tr>';
				html += '    <td><strong>' + escapeHtml(config.name || '') + '</strong>';
				if (config.type) html += ' <span class="label label-info">' + escapeHtml(config.type) + '</span>';
				html += '    </td>';
				html += '    <td><code>' + escapeHtml(config.key) + '</code></td>';
				html += '    <td>' + valueCell + '</td>';
				html += '    <td class="text-muted">' + escapeHtml(config.desc || '-') + '</td>';
				html += '    <td>' + actionBtn + '</td>';
				html += '  </tr>';
			});

			html += '        </tbody>';
			html += '      </table>';
			html += '    </div>';
			html += '  </div>';
			html += '</div>';

			groupIndex++;
		});

		if (configsSource.length === 0) {
			html = '<div class="alert alert-warning" style="margin-top: 20px;">';
			html += '  <h4><i class="icon-warning-sign"></i> 未找到匹配的配置项</h4>';
			html += '</div>';
		}

		app.ui.accordion.html(html);
	}

	function escapeHtml(text) {
		if (text === null || text === undefined) return '';
		return String(text)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	// ==================== 事件绑定 ====================
	function bindEvents() {

		// 搜索(防抖): 在合并后的完整列表上过滤
		var searchTimeout;
		app.ui.searchInput.on('keyup', function() {
			clearTimeout(searchTimeout);
			var keyword = $(this).val();

			searchTimeout = setTimeout(function() {
				var filtered = filterConfigs(keyword);
				// 用过滤后的子集直接渲染(不重新分组全量)
				renderAccordionFromList(filtered);
			}, 300);
		});

		app.ui.refreshBtn.on('click', function() {
			app.ui.searchInput.val('');
			loadConfigs();
		});

		app.ui.addBtn.on('click', function() {
			showCustomAddModal();
		});

		// 编辑/设置值/删除(事件委托)
		app.ui.accordion.on('click', '.edit-btn', function() {
			editConfig($(this).data('key'));
		});
		app.ui.accordion.on('click', '.set-btn', function() {
			setConfig($(this).data('key'));
		});
		app.ui.accordion.on('click', '.delete-btn', function() {
			deleteConfig($(this).data('key'));
		});

		app.ui.saveBtn.on('click', saveConfig);
		app.ui.cancelBtn.on('click', function() {
			app.ui.modal.modal('hide');
		});
		app.ui.deleteBtn.on('click', function() {
			if (app.editingConfig && app.editingConfig.scid) {
				deleteConfig(app.editingKey);
				app.ui.modal.modal('hide');
			}
		});
	}

	// 搜索结果渲染: 用过滤后列表直接渲染(保持分组结构)
	function renderAccordionFromList(list) {
		// 临时替换 mergedConfigs 再渲染
		var backup = app.mergedConfigs;
		app.mergedConfigs = list;
		groupConfigs();
		renderAccordion(list);
		app.mergedConfigs = backup;
	}

	// ==================== 弹窗逻辑 ====================
	// 从目录点击「设置值」(未配置项 → 新增)
	function setConfig(key) {
		var meta = findCatalog(key);
		if (!meta) return;

		app.editingKey = key;
		app.editingConfig = { configured: false };
		app.ui.modalTitle.text('设置配置值 — ' + meta.name);

		fillModalFromCatalog(meta, false);

		// 默认值预填
		app.ui.valueInput.val(meta.defaultValue || '');
		app.ui.commentInput.val('');

		app.ui.deleteBtn.hide();
		app.ui.modal.modal('show');
	}

	// 从目录点击「编辑」(已配置项 → 更新)
	function editConfig(key) {
		var meta = findCatalog(key);
		var db = app.dbConfigMap[key];
		if (!db) return;

		app.editingKey = key;
		app.editingConfig = $.extend({}, meta, { configured: true, scid: db.scid });
		app.ui.modalTitle.text('编辑配置 — ' + (meta ? meta.name : key));

		if (meta) {
			fillModalFromCatalog(meta, true);
		} else {
			// 自定义项(不在目录)
			app.ui.groupSelect.val(db.group || '');
			app.ui.keyInput.val(key);
			app.ui.keyDisplay.text(key);
			app.ui.nameInput.val('');
			app.ui.descBox.text('');
		}

		app.ui.valueInput.val(db.value || '');
		app.ui.commentInput.val(db.comment || '');

		app.ui.deleteBtn.show();
		app.ui.modal.modal('show');
	}

	// 顶部「新增配置」: 自定义目录外的新键
	function showCustomAddModal() {
		app.editingKey = null;
		app.editingConfig = { configured: false };
		app.ui.modalTitle.text('新增自定义配置');

		app.ui.groupSelect.val('');
		app.ui.keyInput.val('').prop('disabled', false);
		app.ui.keyDisplay.text('(可编辑)');
		app.ui.nameInput.val('');
		app.ui.descBox.text('');
		app.ui.valueInput.val('');
		app.ui.commentInput.val('');

		app.ui.deleteBtn.hide();
		app.ui.modal.modal('show');
	}

	function findCatalog(key) {
		for (var i = 0; i < CATALOG.length; i++) {
			if (CATALOG[i].key === key) return CATALOG[i];
		}
		return null;
	}

	function fillModalFromCatalog(meta, isEdit) {
		app.ui.groupSelect.val(meta.group || '');
		app.ui.groupSelect.prop('disabled', false);

		// 配置键: 目录项不可修改,显示但禁用输入
		app.ui.keyInput.val(meta.key).prop('disabled', true);
		app.ui.keyDisplay.text(meta.key + ' (目录项,不可修改)');

		app.ui.nameInput.val(meta.name || '');
		app.ui.descBox.text(meta.desc || '');
	}

	// ==================== 保存(新增/更新) ====================
	function saveConfig() {
		var group = app.ui.groupSelect.val();
		var key = app.ui.keyInput.val();
		var value = app.ui.valueInput.val();
		var comment = app.ui.commentInput.val();

		if (!group) {
			com.showAlert(com.warning, '请选择分组');
			return;
		}
		if (!key) {
			com.showAlert(com.warning, '配置键不能为空');
			return;
		}
		if (value === '') {
			com.showAlert(com.warning, '请输入配置值');
			return;
		}

		var isEdit = app.editingConfig && app.editingConfig.configured && app.editingConfig.scid;

		var options = {
			"systemConfig.group": group,
			"systemConfig.key": key,
			"systemConfig.value": value,
			"systemConfig.comment": comment
		};

		if (isEdit) {
			options["systemConfig.scid"] = app.editingConfig.scid;
		}

		var apiUrl = isEdit ? api.system.updateSystemConfig : api.system.addSystemConfig;

		com.showLoading('正在保存...');
		com.post(apiUrl, options, function(res) {
			com.hideLoading();
			com.showAlert(com.info, '保存成功');
			app.ui.modal.modal('hide');
			loadConfigs();
		}, function(err) {
			com.hideLoading();
			com.showAlert(com.error, '保存失败: ' + (err.errorMsg || '未知错误'));
		});
	}

	// ==================== 删除 ====================
	function deleteConfig(key) {
		var db = app.dbConfigMap[key];
		if (!db) {
			com.showAlert(com.warning, '该项尚未配置,无需删除');
			return;
		}

		com.showConfirm('确定要删除配置项「' + key + '」吗?删除后将恢复为默认值。', function() {
			com.post(api.system.deleteSystemConfig, {
				"systemConfig.scid": db.scid
			}, function() {
				com.showAlert(com.info, '删除成功');
				loadConfigs();
			}, function(err) {
				com.showAlert(com.error, '删除失败: ' + (err.errorMsg || '未知错误'));
			});
		});
	}

	// ==================== 启动 ====================
	init();
});
