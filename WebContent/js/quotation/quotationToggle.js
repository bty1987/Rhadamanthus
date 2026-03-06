/**
 * 报价版本快速切换工具
 * 在浏览器控制台使用
 *
 * 使用示例：
 *   quoToggle.old()   - 切换到原始版本
 *   quooToggle.new()   - 切换到优化版本
 *   quoToggle.reset() - 清除版本选择
 *   quoToggle.info()  - 显示版本信息
 */
var QuotationToggle = (function() {

	/**
	 * 切换到原始版本
	 */
	function switchToOriginal() {
		if (confirm('确定切换到原始版本吗？页面将重新加载。')) {
			var url = new URL(window.location.href);
			url.searchParams.set('quotation_version', 'original');
			window.location.href = url.toString();
		}
	}

	/**
	 * 切换到优化版本
	 */
	function switchToOptimized() {
		if (confirm('确定切换到优化版本吗？页面将重新加载。')) {
			var url = new URL(window.location.href);
			url.searchParams.set('quotation_version', 'optimized');
			window.location.href = url.toString();
		}
	}

	/**
	 * 清除版本选择（使用默认版本）
	 */
	function clearVersion() {
		var url = new URL(window.location.href);
		url.searchParams.delete('quotation_version');
		window.location.href = url.toString();
	}

	/**
	 * 显示当前版本信息
	 */
	function showVersionInfo() {
		var urlVersion = getUrlParam('quotation_version');
		var currentVersion = QuotationVersionConfig ?
			QuotationVersionConfig.getVersionForUser() : 'unknown';
		var versionInfo = QuotationVersionConfig ?
			QuotationVersionConfig.getCurrentVersionInfo() : null;

		console.log('');
		console.log('========================================');
		console.log('        报价模块版本信息');
		console.log('========================================');
		console.log('URL参数版本:', urlVersion || '(未指定)');
		console.log('实际使用版本:', currentVersion);

		if (versionInfo) {
			console.log('版本名称:', versionInfo.name);
			console.log('版本号:', versionInfo.version);
			console.log('文件路径:', versionInfo.file);
		}

		if (QuotationVersionConfig) {
			console.log('----------------------------------------');
			console.log('当前用户:', params.userInfo ? params.userInfo.user.userId : '未知');
			console.log('白名单用户:', QuotationVersionConfig.config.whitelist);
			console.log('黑名单用户:', QuotationVersionConfig.config.blacklist);
			console.log('灰度比例:', QuotationVersionConfig.config.canaryPercentage + '%');
		}

		console.log('========================================');
		console.log('');
		console.log('快捷命令:');
		console.log('  quoToggle.old()    - 切换到原始版本');
		console.log('  quoToggle.new()    - 切换到优化版本');
		console.log('  quoToggle.reset()  - 清除版本选择');
		console.log('  quoToggle.info()   - 显示版本信息');
		console.log('');
	}

	/**
	 * 添加当前用户到白名单
	 */
	function addToWhitelist() {
		if (!QuotationVersionConfig) {
			console.error('QuotationVersionConfig 未加载');
			return;
		}

		var userId = params.userInfo ? params.userInfo.user.userId : null;
		if (!userId) {
			console.error('无法获取当前用户ID');
			return;
		}

		QuotationVersionConfig.addToWhitelist(userId);
		console.log('已添加 ' + userId + ' 到白名单，请刷新页面生效。');
	}

	/**
	 * 从白名单移除当前用户
	 */
	function removeFromWhitelist() {
		if (!QuotationVersionConfig) {
			console.error('QuotationVersionConfig 未加载');
			return;
		}

		var userId = params.userInfo ? params.userInfo.user.userId : null;
		if (!userId) {
			console.error('无法获取当前用户ID');
			return;
		}

		QuotationVersionConfig.removeFromWhitelist(userId);
		console.log('已从白名单移除 ' + userId + '，请刷新页面生效。');
	}

	/**
	 * 添加当前用户到黑名单
	 */
	function addToBlacklist() {
		if (!QuotationVersionConfig) {
			console.error('QuotationVersionConfig 未加载');
			return;
		}

		var userId = params.userInfo ? params.userInfo.user.userId : null;
		if (!userId) {
			console.error('无法获取当前用户ID');
			return;
		}

		QuotationVersionConfig.addToBlacklist(userId);
		console.log('已添加 ' + userId + ' 到黑名单，请刷新页面生效。');
	}

	/**
	 * 运行对比测试
	 */
	function runComparison() {
		console.log('');
		console.log('========== 新旧版本对比测试 ==========');

		// 定义 safeEval 函数（如果还未加载）
		if (typeof safeEval === 'undefined') {
			window.safeEval = function(expres) {
				if (!expres || expres === '') return 0;
				expres = expres.replace(/\s+/g, '');
				var safePattern = /^[\d\+\-\*\/\(\)\.a-zA-Z_]+$/;
				if (!safePattern.test(expres)) return 0;
				var dangerous = ['window', 'document', 'alert', 'console', 'function', 'return', 'this'];
				for (var i = 0; i < dangerous.length; i++) {
					if (expres.indexOf(dangerous[i]) !== -1) return 0;
				}
				try {
					var result = new Function('return (' + expres + ')')();
					if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) return 0;
					if (result < 0 || result > 10000000) return 0;
					return result;
				} catch (e) {
					return 0;
				}
			};
		}

		// 测试用例
		var testCases = [
			{ formula: '2 + 3', expected: 5, desc: '简单加法' },
			{ formula: '10 * 5', expected: 50, desc: '乘法' },
			{ formula: '(10 + 5) * 2', expected: 30, desc: '括号优先' },
			{ formula: '100 / 4', expected: 25, desc: '除法' },
			{ formula: '10 + 5 * 2', expected: 20, desc: '运算优先级' },
			{ formula: '0', expected: 0, desc: '零值' },
			{ formula: '123.45 + 67.89', expected: 191.34, desc: '小数运算' },
			{ formula: '', expected: 0, desc: '空字符串' },
			{ formula: 'alert(1)', expected: 0, desc: '恶意代码拦截' },
			{ formula: 'window.location', expected: 0, desc: '恶意代码拦截' }
		];

		var passed = 0;
		var failed = 0;

		testCases.forEach(function(t, i) {
			// 旧版本计算（eval）
			var oldResult = 0;
			try {
				oldResult = eval(t.formula);
				if (isNaN(oldResult) || !isFinite(oldResult)) oldResult = 0;
			} catch (e) {
				oldResult = 0;
			}

			// 新版本计算（safeEval）
			var newResult = safeEval(t.formula);

			// 对比结果
			var diff = Math.abs(oldResult - newResult);
			var isPass = diff < 0.001;

			if (isPass) {
				passed++;
				console.log('%c✅ 测试' + (i + 1) + '通过: ' + t.desc, 'color: green');
				console.log('   公式: ' + t.formula);
				console.log('   结果: ' + newResult);
			} else {
				failed++;
				console.error('%c❌ 测试' + (i + 1) + '失败: ' + t.desc, 'color: red');
				console.error('   公式: ' + t.formula);
				console.error('   旧版本: ' + oldResult);
				console.error('   新版本: ' + newResult);
				console.error('   差异: ' + diff);
			}
		});

		console.log('');
		console.log('========================================');
		if (failed === 0) {
			console.log('%c所有测试通过！', 'color: green; font-weight: bold; font-size: 14px');
		} else {
			console.log('%c有 ' + failed + ' 个测试失败！', 'color: red; font-weight: bold; font-size: 14px');
		}
		console.log('通过: ' + passed + ' / ' + testCases.length);
		console.log('失败: ' + failed + ' / ' + testCases.length);
		console.log('========================================');
		console.log('');

		return failed === 0;
	}

	function getUrlParam(name) {
		var regex = new RegExp('[?&]' + name + '=([^&#]*)');
		var results = regex.exec(window.location.href);
		return results ? results[1] : null;
	}

	// 暴露全局快捷命令
	window.quoToggle = {
		old: switchToOriginal,
		new: switchToOptimized,
		reset: clearVersion,
		info: showVersionInfo,
		whitelist: {
			add: addToWhitelist,
			remove: removeFromWhitelist
		},
		blacklist: {
			add: addToBlacklist
		},
		test: runComparison
	};

	// 初始化时显示帮助信息
	if (window.console) {
		console.log('');
		console.log('%c========== 报价版本切换工具 ==========', 'color: #0066cc; font-weight: bold');
		console.log('快捷命令:');
		console.log('  %cquoToggle.old()%c    - 切换到原始版本', 'color: #009900', 'color: inherit');
		console.log('  %cquoToggle.new()%c    - 切换到优化版本', 'color: #009900', 'color: inherit');
		console.log('  %cquoToggle.reset()%c  - 清除版本选择', 'color: #009900', 'color: inherit');
		console.log('  %cquoToggle.info()%c   - 显示版本信息', 'color: #009900', 'color: inherit');
		console.log('  %cquoToggle.test()%c   - 运行对比测试', 'color: #009900', 'color: inherit');
		console.log('  %cquoToggle.whitelist.add()%c - 添加当前用户到白名单', 'color: #009900', 'color: inherit');
		console.log('=======================================');
		console.log('');
	}

	return {
		switchToOriginal: switchToOriginal,
		switchToOptimized: switchToOptimized,
		clearVersion: clearVersion,
		showVersionInfo: showVersionInfo,
		runComparison: runComparison
	};

})();
