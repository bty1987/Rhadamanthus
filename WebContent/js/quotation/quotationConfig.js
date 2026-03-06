/**
 * 报价模块版本配置
 * 控制 A/B 版本切换
 *
 * @version 1.0.0
 * @date 2026-03-05
 */
var QuotationVersionConfig = (function() {

	// ==================== 配置项 ====================

	var config = {
		// 当前使用的版本: 'original' | 'optimized'
		currentVersion: 'original',

		// 白名单用户ID列表（优先使用新版本）
		whitelist: [],

		// 黑名单用户ID列表（永不使用新版本）
		blacklist: [],

		// 灰度比例 (0-100)
		canaryPercentage: 0,

		// 版本信息
		versions: {
			original: {
				name: '原始版本',
				file: 'js/quotation/quotationPart.js',
				version: '1.0.0'
			},
			optimized: {
				name: '优化版本',
				file: 'js/quotation/quotationPart.opt.js',
				version: '2.0.0-opt'
			}
		}
	};

	// ==================== 初始化：从服务器加载配置 ====================

	function init(callback) {
		// 从服务器获取配置（如果有）
		com.post(api.system.getModuleConfig, {
			'module': 'quotation'
		}, function(res) {
			if (res.config && res.config.quotationVersion) {
				config.currentVersion = res.config.quotationVersion;
				config.whitelist = res.config.whitelist || [];
				config.blacklist = res.config.blacklist || [];
				config.canaryPercentage = res.config.canaryPercentage || 0;
			}
			console.log('[QuotationConfig] 当前版本:', config.currentVersion);
			if (callback) callback();
		}, function() {
			// 接口失败，使用默认配置
			if (callback) callback();
		}, false);
	}

	// ==================== 版本判断逻辑 ====================

	/**
	 * 判断当前用户应该使用哪个版本
	 * @returns {string} 'original' | 'optimized'
	 */
	function getVersionForUser() {
		var userId = getCurrentUserId();

		// 1. 检查是否强制指定版本（URL参数）
		var urlVersion = getUrlParam('quotation_version');
		if (urlVersion && config.versions[urlVersion]) {
			console.log('[QuotationConfig] 使用URL指定版本:', urlVersion);
			return urlVersion;
		}

		// 2. 检查黑名单（黑名单用户永远用旧版本）
		if (userId && config.blacklist.indexOf(userId) !== -1) {
			console.log('[QuotationConfig] 用户在黑名单，使用旧版本');
			return 'original';
		}

		// 3. 检查白名单（白名单用户用新版本）
		if (userId && config.whitelist.indexOf(userId) !== -1) {
			console.log('[QuotationConfig] 用户在白名单，使用新版本');
			return 'optimized';
		}

		// 4. 检查是否启用新版本
		if (config.currentVersion === 'optimized') {
			return 'optimized';
		}

		// 5. 根据灰度比例判断
		if (config.canaryPercentage > 0 && userId) {
			var hash = hashString(userId);
			if (hash % 100 < config.canaryPercentage) {
				console.log('[QuotationConfig] 灰度命中，使用新版本');
				return 'optimized';
			}
		}

		// 默认使用旧版本
		return 'original';
	}

	/**
	 * 获取当前用户ID
	 */
	function getCurrentUserId() {
		if (params.userInfo && params.userInfo.user) {
			return params.userInfo.user.userId;
		}
		return null;
	}

	/**
	 * 获取URL参数
	 */
	function getUrlParam(name) {
		var regex = new RegExp('[?&]' + name + '=([^&#]*)');
		var results = regex.exec(window.location.href);
		return results ? results[1] : null;
	}

	/**
	 * 字符串哈希（0-9999）
	 */
	function hashString(str) {
		var hash = 0;
		for (var i = 0; i < str.length; i++) {
			var char = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash;
		}
		return Math.abs(hash) % 10000;
	}

	// ==================== 版本切换控制 ====================

	/**
	 * 切换到指定版本（需要权限）
	 */
	function switchVersion(version) {
		if (!config.versions[version]) {
			console.error('[QuotationConfig] 无效版本:', version);
			return false;
		}

		com.post(api.system.updateModuleConfig, {
			'module': 'quotation',
			'config': {
				'quotationVersion': version
			}
		}, function(res) {
			config.currentVersion = version;
			console.log('[QuotationConfig] 版本已切换到:', version);
			location.reload();
		});
	}

	/**
	 * 设置灰度比例
	 */
	function setCanaryPercentage(percentage) {
		com.post(api.system.updateModuleConfig, {
			'module': 'quotation',
			'config': {
				'canaryPercentage': percentage
			}
		}, function(res) {
			config.canaryPercentage = percentage;
			console.log('[QuotationConfig] 灰度比例已设置:', percentage);
		});
	}

	/**
	 * 添加白名单用户
	 */
	function addToWhitelist(userId) {
		if (config.whitelist.indexOf(userId) === -1) {
			config.whitelist.push(userId);
			saveWhitelist();
			console.log('[QuotationConfig] 已添加到白名单:', userId);
		}
	}

	/**
	 * 从白名单移除用户
	 */
	function removeFromWhitelist(userId) {
		var index = config.whitelist.indexOf(userId);
		if (index !== -1) {
			config.whitelist.splice(index, 1);
			saveWhitelist();
			console.log('[QuotationConfig] 已从白名单移除:', userId);
		}
	}

	/**
	 * 保存白名单到服务器
	 */
	function saveWhitelist() {
		com.post(api.system.updateModuleConfig, {
			'module': 'quotation',
			'config': {
				'whitelist': config.whitelist
			}
		}, function(res) {
			console.log('[QuotationConfig] 白名单已保存');
		});
	}

	/**
	 * 添加黑名单用户
	 */
	function addToBlacklist(userId) {
		if (config.blacklist.indexOf(userId) === -1) {
			config.blacklist.push(userId);
			saveBlacklist();
			console.log('[QuotationConfig] 已添加到黑名单:', userId);
		}
	}

	/**
	 * 从黑名单移除用户
	 */
	function removeFromBlacklist(userId) {
		var index = config.blacklist.indexOf(userId);
		if (index !== -1) {
			config.blacklist.splice(index, 1);
			saveBlacklist();
			console.log('[QuotationConfig] 已从黑名单移除:', userId);
		}
	}

	/**
	 * 保存黑名单到服务器
	 */
	function saveBlacklist() {
		com.post(api.system.updateModuleConfig, {
			'module': 'quotation',
			'config': {
				'blacklist': config.blacklist
			}
		}, function(res) {
			console.log('[QuotationConfig] 黑名单已保存');
		});
	}

	// ==================== 版本信息 ====================

	/**
	 * 获取当前版本信息
	 */
	function getCurrentVersionInfo() {
		var version = getVersionForUser();
		return config.versions[version];
	}

	/**
	 * 获取版本文件路径
	 */
	function getVersionFilePath() {
		var version = getVersionForUser();
		return config.versions[version].file;
	}

	// ==================== 对外接口 ====================

	return {
		// 初始化
		init: init,

		// 版本判断
		getVersionForUser: getVersionForUser,
		getCurrentVersionInfo: getCurrentVersionInfo,
		getVersionFilePath: getVersionFilePath,

		// 版本控制
		switchVersion: switchVersion,
		setCanaryPercentage: setCanaryPercentage,

		// 白名单管理
		addToWhitelist: addToWhitelist,
		removeFromWhitelist: removeFromWhitelist,

		// 黑名单管理
		addToBlacklist: addToBlacklist,
		removeFromBlacklist: removeFromBlacklist,

		// 配置访问（调试用）
		config: config
	};

})();
