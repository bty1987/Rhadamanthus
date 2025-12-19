/**
 * 企业微信登录专用脚本
 * 支持扫码登录和点击登录两种方式
 */

jQuery(function($) {
    // ========== 配置信息 ==========
    var WORK_WECHAT_CONFIG = {
        socialType: 20,
        gatewayUrl: 'https://daily-gateway.fanglin.vip',
        localProxyUrl: 'workWechatProxy.do', // 本地代理接口
        redirectUri: window.location.origin + '/xlogin.html',
        loginCheckInterval: 3000, // 登录状态检查间隔
        maxCheckCount: 60, // 最大检查次数（5分钟）
        apiMode: 'jsonp' // 调用模式：'direct'(直接调用), 'proxy'(代理), 'jsonp'(JSONP), 'form'(表单提交)
    };

    // ========== 全局变量 ==========
    var currentMethod = 'qrcode'; // 当前登录方式：qrcode 或 click
    var loginCheckTimer = null; // 登录状态检查定时器
    var checkCount = 0; // 检查次数计数器
    var currentLoginFlag = null; // 当前登录标识

    // ========== 初始化 ==========
    initPage();

    /**
     * 页面初始化
     */
    function initPage() {
        console.log('企业微信登录页面初始化...');

        // 检查配置
        checkConfig();

        // 初始化登录方式切换
        initMethodSwitch();

        // 初始化帮助弹窗
        initHelpModal();

        // 检查登录回调
        checkLoginCallback();

        // 默认初始化扫码登录
        initQRCodeLogin();
    }

    /**
     * 检查配置
     */
    function checkConfig() {
        // Demo模式检查
        if (config.demo) {
            WORK_WECHAT_CONFIG.gatewayUrl = 'result/';
            WORK_WECHAT_CONFIG.apiMode = 'demo';
            console.log('Demo模式已启用');
            return;
        }

        // 根据环境配置
        if (config.intranet) {
            // 内网环境配置
            WORK_WECHAT_CONFIG.gatewayUrl = 'http://192.168.5.21:8080';
            WORK_WECHAT_CONFIG.localProxyUrl = 'workWechatProxy.do';
        }

        // 检测CORS问题，自动切换模式
        detectCORSIssue();

        console.log('企业微信配置:', WORK_WECHAT_CONFIG);
    }

    /**
     * 检测CORS问题并自动切换模式
     */
    function detectCORSIssue() {
        // 尝试直接调用，如果失败则切换到代理模式
        if (WORK_WECHAT_CONFIG.apiMode === 'direct') {
            // 创建一个测试请求来检测CORS
            var testUrl = WORK_WECHAT_CONFIG.gatewayUrl + '/admin-api/user/auth/sso/social-auth-redirect';

            // 使用fetch测试CORS
            fetch(testUrl + '?test=1', {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit'
            }).then(function(response) {
                // 如果成功，保持direct模式
                console.log('CORS测试通过，使用直接调用模式');
            }).catch(function(error) {
                console.warn('CORS测试失败，自动切换到代理模式:', error.message);
                WORK_WECHAT_CONFIG.apiMode = 'proxy';
            });
        }
    }

    /**
     * 初始化登录方式切换
     */
    function initMethodSwitch() {
        $('.method-item').on('click', function() {
            var $this = $(this);
            var method = $this.data('method');

            if (method === currentMethod) return;

            // 切换激活状态
            $('.method-item').removeClass('active');
            $this.addClass('active');

            // 切换面板
            $('.login-form-panel').removeClass('active');
            if (method === 'qrcode') {
                $('#qrcodePanel').addClass('active');
                initQRCodeLogin();
            } else if (method === 'click') {
                $('#clickPanel').addClass('active');
                initClickLogin();
            }

            currentMethod = method;

            // 清理之前的登录检查
            clearLoginCheck();
        });
    }

    /**
     * 初始化帮助弹窗
     */
    function initHelpModal() {
        $('#helpLink').on('click', function() {
            $('#helpModal').modal('show');
        });

        // 其他登录链接
        $('#dingdingLink').on('click', function() {
            window.location.href = 'login.html#qrcode';
        });
    }

    /**
     * 检查登录回调
     */
    function checkLoginCallback() {
        // 检查URL参数
        var urlParams = new URLSearchParams(window.location.search);
        var authType = urlParams.get('auth_type');
        var code = urlParams.get('code');
        var state = urlParams.get('state');

        if (authType === 'work_wechat' && code && state) {
            console.log('检测到企业微信登录回调');
            handleWorkWechatCallback(code, state);
        }
    }

    /**
     * 初始化扫码登录
     */
    function initQRCodeLogin() {
        console.log('初始化企业微信扫码登录...');
        clearLoginCheck();
        resetQRCodeUI();

        if (config.demo) {
            // Demo模式
            showQRCodeDemo();
            return;
        }

        // 显示加载状态
        showQRCodeLoading('正在生成企业微信二维码...');

        var requestData = {
            redirectUri: WORK_WECHAT_CONFIG.redirectUri + '?auth_type=work_wechat',
            socialType: WORK_WECHAT_CONFIG.socialType
        };

        // 使用通用API调用方法
        callAPI('/admin-api/user/auth/sso/social-auth-redirect', 'GET', requestData, function(response) {
            if (response.code === 0 && response.data) {
                // 解析返回的URL，提取state参数
                var wechatUrl = new URL(response.data);
                var state = wechatUrl.searchParams.get('state');

                if (state) {
                    currentLoginFlag = state;
                    generateQRCode(response.data);
                    startLoginCheck(state);
                } else {
                    showQRCodeError('无效的登录链接');
                }
            } else {
                showQRCodeError(response.msg || '获取登录链接失败');
            }
        }, function(error) {
            console.error('获取企业微信二维码失败:', error);
            showQRCodeError('网络错误，请检查连接');
        });
    }

    /**
     * 生成二维码
     */
    function generateQRCode(loginUrl) {
        // 使用第三方二维码生成服务或本地生成
        var qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(loginUrl);

        $('#workWechatQR').html(`
            <div class="qrcode-wrapper">
                <img src="${qrApiUrl}" alt="企业微信二维码" class="qrcode-image">
                <div class="qrcode-border"></div>
            </div>
        `);

        $('.qrcode-tip').html('<i class="ace-icon fa fa-mobile"></i><span>请使用<strong>企业微信</strong>扫码登录</span>');
    }

    /**
     * 显示Demo模式二维码
     */
    function showQRCodeDemo() {
        $('#workWechatQR').html(`
            <div class="demo-qr-code">
                <img src="images/verifyCode.jpg" alt="Demo二维码" class="qrcode-image">
                <div class="demo-badge">Demo</div>
            </div>
        `);

        $('.qrcode-tip').html('<i class="ace-icon fa fa-info-circle"></i><span>Demo模式：点击<span class="demo-link">模拟登录</span></span>');

        $('.demo-link').on('click', function() {
            simulateDemoLogin();
        });
    }

    /**
     * 模拟Demo登录
     */
    function simulateDemoLogin() {
        showQRCodeSuccess();
        setTimeout(function() {
            setCookie("authentication", "demo_token_" + new Date().getTime(), config.timeout);
            setCookie("loginTime", new Date().getTime(), config.timeout);
            setCookie("loginType", "work_wechat", config.timeout);
            setCookie("userName", "企业微信用户", config.timeout);
            window.location.href = "index.html?timestamp=" + new Date().getTime();
        }, 1500);
    }

    /**
     * 开始登录状态检查
     */
    function startLoginCheck(loginFlag) {
        if (!loginFlag) return;

        checkCount = 0;
        loginCheckTimer = setTimeout(function() {
            checkLoginStatus(loginFlag);
        }, WORK_WECHAT_CONFIG.loginCheckInterval);
    }

    /**
     * 检查登录状态
     */
    function checkLoginStatus(loginFlag) {
        if (checkCount >= WORK_WECHAT_CONFIG.maxCheckCount) {
            showQRCodeError('二维码已失效，请刷新重试');
            return;
        }

        checkCount++;

        $.ajax({
            url: WORK_WECHAT_CONFIG.gatewayUrl + '/admin-api/user/auth/sso/social-login-status',
            method: 'GET',
            headers: {
                'notauth': 'true'
            },
            data: {
                socialType: WORK_WECHAT_CONFIG.socialType,
                socialState: loginFlag
            },
            success: function(response) {
                if (response.code === 0) {
                    if (response.data && response.data.status === 'success') {
                        // 登录成功
                        handleLoginSuccess(response.data);
                    } else if (response.data && response.data.status === 'pending') {
                        // 继续等待
                        loginCheckTimer = setTimeout(function() {
                            checkLoginStatus(loginFlag);
                        }, WORK_WECHAT_CONFIG.loginCheckInterval);
                    } else {
                        // 登录失败
                        showQRCodeError(response.msg || '登录失败');
                    }
                } else {
                    // 继续等待或显示错误
                    if (response.msg && response.msg.includes('pending')) {
                        loginCheckTimer = setTimeout(function() {
                            checkLoginStatus(loginFlag);
                        }, WORK_WECHAT_CONFIG.loginCheckInterval);
                    } else {
                        showQRCodeError(response.msg || '检查登录状态失败');
                    }
                }
            },
            error: function() {
                // 网络错误，继续重试
                if (checkCount < 10) { // 最多重试10次
                    loginCheckTimer = setTimeout(function() {
                        checkLoginStatus(loginFlag);
                    }, WORK_WECHAT_CONFIG.loginCheckInterval);
                } else {
                    showQRCodeError('网络连接异常，请刷新重试');
                }
            }
        });
    }

    /**
     * 处理企业微信登录回调
     */
    function handleWorkWechatCallback(code, state) {
        console.log('处理企业微信登录回调:', { code: code, state: state });

        // 显示加载状态
        showClickLoginLoading('正在验证企业微信登录...');

        $.ajax({
            url: WORK_WECHAT_CONFIG.gatewayUrl + '/admin-api/user/auth/sso/social-login',
            method: 'POST',
            headers: {
                'notauth': 'true',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                socialType: WORK_WECHAT_CONFIG.socialType,
                socialCode: code,
                socialState: state
            }),
            success: function(response) {
                if (response.code === 0 && response.data) {
                    handleLoginSuccess(response.data);
                } else {
                    showClickLoginError(response.msg || '企业微信登录验证失败');
                }
            },
            error: function(xhr, status, error) {
                console.error('企业微信登录验证失败:', error);
                showClickLoginError('网络错误，请重试');
            }
        });
    }

    /**
     * 处理登录成功
     */
    function handleLoginSuccess(loginData) {
        console.log('企业微信登录成功:', loginData);

        // 显示成功状态
        if (currentMethod === 'qrcode') {
            showQRCodeSuccess();
        } else {
            showClickLoginSuccess();
        }

        // 设置登录信息
        var token = loginData.token || loginData.authentication || loginData.access_token;
        var userInfo = loginData.userInfo || loginData.user || {};

        setCookie("authentication", token, config.timeout);
        setCookie("loginTime", new Date().getTime(), config.timeout);
        setCookie("loginType", "work_wechat", config.timeout);

        if (userInfo.name || userInfo.userName || userInfo.nickname) {
            setCookie("userName", userInfo.name || userInfo.userName || userInfo.nickname, config.timeout);
        }

        if (userInfo.userId || userInfo.id) {
            setCookie("userId", userInfo.userId || userInfo.id, config.timeout);
        }

        // 跳转到主页面
        setTimeout(function() {
            window.location.href = "index.html?timestamp=" + new Date().getTime();
        }, 1500);
    }

    /**
     * 初始化点击登录
     */
    function initClickLogin() {
        console.log('初始化企业微信点击登录...');
        resetClickLoginUI();

        $('#workWechatLoginBtn').on('click', function() {
            startWorkWechatClickLogin();
        });
    }

    /**
     * 开始企业微信点击登录
     */
    function startWorkWechatClickLogin() {
        console.log('启动企业微信点击登录...');

        if (config.demo) {
            simulateDemoLogin();
            return;
        }

        showClickLoginLoading('正在跳转到企业微信...');

        var redirectUri = encodeURIComponent(WORK_WECHAT_CONFIG.redirectUri + '?auth_type=work_wechat');
        var authUrl = WORK_WECHAT_CONFIG.gatewayUrl +
                      '/admin-api/user/auth/sso/social-auth-redirect?' +
                      'redirectUri=' + redirectUri +
                      '&socialType=' + WORK_WECHAT_CONFIG.socialType;

        $.ajax({
            url: authUrl,
            method: 'GET',
            headers: {
                'notauth': 'true'
            },
            success: function(response) {
                if (response.code === 0 && response.data) {
                    // 跳转到企业微信登录页面
                    window.location.href = response.data;
                } else {
                    showClickLoginError(response.msg || '获取企业微信登录链接失败');
                }
            },
            error: function() {
                showClickLoginError('网络错误，请重试');
            }
        });
    }

    // ========== UI状态管理 ==========

    function showQRCodeLoading(message) {
        $('#workWechatQR').html(`
            <div class="qrcode-placeholder">
                <i class="ace-icon fa fa-spinner fa-spin fa-2x"></i>
                <p>${message || '正在处理...'}</p>
            </div>
        `);
    }

    function showQRCodeError(message) {
        clearLoginCheck();
        $('#workWechatQR').html(`
            <div class="qrcode-error">
                <i class="ace-icon fa fa-exclamation-triangle fa-2x"></i>
                <p>${message}</p>
            </div>
        `);
        $('#qrcodeRefresh').removeClass('hide').find('#refreshText').text(message);
    }

    function showQRCodeSuccess() {
        clearLoginCheck();
        $('#qrcodePanel').find('.qrcode-area').addClass('success');
        $('#qrcodeSuccess').removeClass('hide');
        $('.qrcode-tip').addClass('hide');
    }

    function resetQRCodeUI() {
        clearLoginCheck();
        $('#qrcodePanel').find('.qrcode-area').removeClass('success');
        $('#qrcodeSuccess, #qrcodeRefresh').addClass('hide');
        $('.qrcode-tip').removeClass('hide');
    }

    function showClickLoginLoading(message) {
        $('#workWechatLoginBtn')
            .prop('disabled', true)
            .html('<i class="ace-icon fa fa-spinner fa-spin"></i><span>' + (message || '正在处理...') + '</span>');
    }

    function showClickLoginError(message) {
        $('#workWechatLoginBtn')
            .prop('disabled', false)
            .html('<i class="ace-icon fa fa-weixin"></i><span>重试企业微信登录</span>');

        // 显示错误提示
        if (!$('#clickError').length) {
            $('#workWechatLoginBtn').after(`
                <div class="alert alert-danger" id="clickError">
                    <i class="ace-icon fa fa-exclamation-triangle"></i>
                    ${message}
                </div>
            `);
        }

        setTimeout(function() {
            $('#clickError').fadeOut(function() {
                $(this).remove();
            });
        }, 5000);
    }

    function showClickLoginSuccess() {
        $('#clickPanel').find('.login-info').html(`
            <i class="ace-icon fa fa-check-circle fa-3x text-success"></i>
            <h3>登录成功！</h3>
            <p>正在跳转到系统主页...</p>
        `);
        $('#workWechatLoginBtn').hide();
    }

    function resetClickLoginUI() {
        $('#workWechatLoginBtn')
            .prop('disabled', false)
            .html('<i class="ace-icon fa fa-weixin"></i><span>使用企业微信登录</span><i class="ace-icon fa fa-arrow-right"></i>');
        $('#clickError').remove();
    }

    /**
     * 清理登录检查
     */
    function clearLoginCheck() {
        if (loginCheckTimer) {
            clearTimeout(loginCheckTimer);
            loginCheckTimer = null;
        }
        checkCount = 0;
        currentLoginFlag = null;
    }

    // ========== API调用方法 ==========

    /**
     * 通用API调用方法，支持多种模式避免CORS问题
     * @param {string} endpoint - 接口路径
     * @param {string} method - HTTP方法
     * @param {object} data - 请求数据
     * @param {function} success - 成功回调
     * @param {function} error - 错误回调
     */
    function callAPI(endpoint, method, data, success, error) {
        var mode = WORK_WECHAT_CONFIG.apiMode;
        console.log('调用API:', endpoint, '模式:', mode);

        switch (mode) {
            case 'direct':
                callAPIDirect(endpoint, method, data, success, error);
                break;
            case 'proxy':
                callAPIProxy(endpoint, method, data, success, error);
                break;
            case 'jsonp':
                callAPIJSONP(endpoint, method, data, success, error);
                break;
            case 'form':
                callAPIForm(endpoint, method, data, success, error);
                break;
            case 'demo':
                callAPIDemo(endpoint, method, data, success, error);
                break;
            default:
                console.warn('未知的API调用模式:', mode, '使用代理模式');
                callAPIProxy(endpoint, method, data, success, error);
        }
    }

    /**
     * 直接调用API（可能遇到CORS问题）
     */
    function callAPIDirect(endpoint, method, data, success, error) {
        var url = WORK_WECHAT_CONFIG.gatewayUrl + endpoint;
        var ajaxConfig = {
            url: url,
            method: method,
            headers: {
                'notauth': 'true',
                'Content-Type': 'application/json'
            },
            success: function(response) {
                console.log('直接API调用成功:', response);
                if (success) success(response);
            },
            error: function(xhr, status, err) {
                console.error('直接API调用失败:', xhr.status, err);
                // CORS错误时自动切换到代理模式
                if (xhr.status === 0 && err.includes('CORS')) {
                    console.log('检测到CORS问题，切换到代理模式');
                    WORK_WECHAT_CONFIG.apiMode = 'proxy';
                    callAPIProxy(endpoint, method, data, success, error);
                } else if (error) {
                    error(xhr, status, err);
                }
            }
        };

        if (method === 'GET') {
            ajaxConfig.data = data;
        } else {
            ajaxConfig.data = JSON.stringify(data);
        }

        $.ajax(ajaxConfig);
    }

    /**
     * 通过本地代理调用API
     */
    function callAPIProxy(endpoint, method, data, success, error) {
        var url = config.communion + WORK_WECHAT_CONFIG.localProxyUrl;

        $.ajax({
            url: url,
            method: 'POST',
            data: {
                endpoint: endpoint,
                method: method,
                data: JSON.stringify(data),
                gatewayUrl: WORK_WECHAT_CONFIG.gatewayUrl
            },
            success: function(response) {
                console.log('代理API调用成功:', response);
                if (success) success(response);
            },
            error: function(xhr, status, err) {
                console.error('代理API调用失败:', err);
                if (error) error(xhr, status, err);
            }
        });
    }

    /**
     * 使用JSONP方式调用API（通过代理页面）
     */
    function callAPIJSONP(endpoint, method, data, success, error) {
        if (method !== 'GET') {
            console.log('POST请求无法使用JSONP，切换到表单提交模式');
            callAPIForm(endpoint, method, data, success, error);
            return;
        }

        var callbackName = 'workwechat_callback_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        var proxyUrl = 'workWechatJsonpProxy.html';

        // 构建代理URL参数
        var queryParams = [];
        queryParams.push('endpoint=' + encodeURIComponent(endpoint));
        queryParams.push('method=' + encodeURIComponent(method));
        queryParams.push('callback=' + callbackName);

        // 添加业务参数
        if (data && typeof data === 'object') {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    queryParams.push(key + '=' + encodeURIComponent(data[key]));
                }
            }
        }

        // 添加时间戳防止缓存
        queryParams.push('_=' + Date.now());

        var finalUrl = proxyUrl + '?' + queryParams.join('&');

        console.log('JSONP代理请求URL:', finalUrl);

        // 创建全局回调函数
        window[callbackName] = function(response) {
            console.log('JSONP代理响应:', response);

            // 清理回调函数
            try {
                delete window[callbackName];
            } catch (e) {
                window[callbackName] = undefined;
            }

            // 移除iframe
            if (window[callbackName + '_iframe']) {
                document.body.removeChild(window[callbackName + '_iframe']);
                window[callbackName + '_iframe'] = undefined;
            }

            // 处理响应
            if (success && typeof success === 'function') {
                success(response);
            }
        };

        // 创建隐藏的iframe来执行代理请求
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = finalUrl;

        // 保存iframe引用以便后续清理
        window[callbackName + '_iframe'] = iframe;

        // 错误处理
        iframe.onerror = function() {
            console.error('JSONP代理iframe加载失败');

            // 清理回调函数
            try {
                delete window[callbackName];
            } catch (e) {
                window[callbackName] = undefined;
            }

            // 移除iframe
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }

            if (error && typeof error === 'function') {
                error({ status: 0, statusText: 'JSONP代理加载失败' }, 'error', 'Proxy load failed');
            }
        };

        // 设置超时
        var timeout = setTimeout(function() {
            console.error('JSONP代理请求超时');

            // 清理回调函数
            try {
                delete window[callbackName];
            } catch (e) {
                window[callbackName] = undefined;
            }

            // 移除iframe
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }

            if (error && typeof error === 'function') {
                error({ status: 0, statusText: 'JSONP代理请求超时' }, 'timeout', 'Request timeout');
            }
        }, 20000); // 20秒超时

        document.body.appendChild(iframe);
    }

    /**
     * 使用表单提交方式调用API
     */
    function callAPIForm(endpoint, method, data, success, error) {
        var formId = 'hiddenForm_' + Date.now();
        var form = $('<form>', {
            id: formId,
            method: method,
            action: WORK_WECHAT_CONFIG.gatewayUrl + endpoint,
            target: 'hiddenFrame_' + Date.now(),
            style: 'display:none'
        });

        // 添加必要的数据
        $.each(data, function(key, value) {
            $('<input>', {
                type: 'hidden',
                name: key,
                value: value
            }).appendTo(form);
        });

        // 添加notauth头
        $('<input>', {
            type: 'hidden',
            name: 'notauth',
            value: 'true'
        }).appendTo(form);

        // 创建隐藏的iframe
        var iframeId = 'hiddenFrame_' + Date.now();
        var iframe = $('<iframe>', {
            id: iframeId,
            name: iframeId,
            style: 'display:none'
        });

        $('body').append(form, iframe);

        iframe.on('load', function() {
            try {
                var iframeDoc = iframe[0].contentDocument || iframe[0].contentWindow.document;
                var responseText = iframeDoc.body.innerText || iframeDoc.body.textContent;
                if (responseText) {
                    var response = JSON.parse(responseText);
                    if (success) success(response);
                }
            } catch (e) {
                console.error('解析表单响应失败:', e);
                if (error) error(null, 'parse_error', e.message);
            }
            // 清理
            setTimeout(function() {
                form.remove();
                iframe.remove();
            }, 100);
        });

        form.submit();
    }

    /**
     * Demo模式API调用
     */
    function callAPIDemo(endpoint, method, data, success, error) {
        console.log('Demo模式API调用:', endpoint, data);

        // 模拟响应
        var mockResponse = {
            code: 0,
            msg: 'ok',
            data: endpoint.includes('social-auth-redirect') ?
                'https://login.work.weixin.qq.com/wwlogin/sso/login?login_type=CorpApp&appid=wxb1cda3fb8dcd9eb1&agentid=1000047&state=demo_state_' + Date.now() + '&lang=zh&redirect_uri=' + encodeURIComponent(data.redirectUri) + '#wechat_redirect' :
                { token: 'demo_token_' + Date.now(), userInfo: { name: '企业微信用户', userId: 'demo_user' } }
        };

        setTimeout(function() {
            if (success) success(mockResponse);
        }, 1000); // 模拟网络延迟
    }

    // ========== 工具函数 ==========

    /**
     * 设置 Cookie
     */
    function setCookie(cname, cvalue, minutes) {
        var d = new Date();
        d.setTime(d.getTime() + (minutes * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
    }

    /**
     * 获取 Cookie
     */
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // ========== 页面卸载清理 ==========
    $(window).on('beforeunload', function() {
        clearLoginCheck();
    });
});