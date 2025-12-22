/**
 * 企业微信登录脚本 - 重构版本
 * 保留所有原有功能，简化代码结构
 */

jQuery(function($) {
    // ========== 配置信息 ==========
    const CONFIG = {
        socialAuthCodeUrl: config.server + 'socialAuthCode.do',
        stateAuthCodeUrl: config.server + 'stateAuthCode.do',
        redirectUri: window.location.origin + '/xlogin.html',
        iframeHeight: 500,
        loadTimeout: 15000
    };

    // ========== 状态管理 ==========
    const State = {
        currentMethod: 'qrcode',
        currentAuthCode: null
    };

    // ========== 工具函数 ==========
    const Utils = {
        // 设置Cookie
        setCookie(name, value, minutes) {
            const d = new Date();
            d.setTime(d.getTime() + (minutes * 60 * 1000));
            document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
        },

        // 获取URL参数
        getUrlParams() {
            return new URLSearchParams(window.location.search);
        },

        // 显示消息
        showMessage(message, type = 'info') {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    };

    // ========== UI状态管理 ==========
    const UI = {
        // 切换登录方式
        switchMethod(method) {
            if (method === State.currentMethod) return;

            $('.method-item').removeClass('active');
            $(`.method-item[data-method="${method}"]`).addClass('active');

            $('.login-form-panel').removeClass('active');
            $(`#${method}Panel`).addClass('active');

            State.currentMethod = method;
        },

        // 显示iframe
        showIframe(url) {
            $('#workWechatQR').addClass('hide');
            $('#iframeContainer').removeClass('hide');
            $('#workWechatIframe').attr('src', url);
            $('.work-wechat-iframe').css('height', CONFIG.iframeHeight + 'px');
            this.updateTip('正在打开<strong>企业微信登录页面</strong>', 'desktop');
        },

        // 关闭iframe
        closeIframe() {
            $('#workWechatQR').removeClass('hide');
            $('#iframeContainer').addClass('hide');
            $('#workWechatIframe').attr('src', '');
            this.updateTip('请使用<strong>企业微信</strong>扫码登录', 'mobile');
        },

        // 显示二维码加载状态
        showQRLoading() {
            $('#workWechatQR').html(`
                <div class="qrcode-placeholder">
                    <i class="ace-icon fa fa-spinner fa-spin fa-2x"></i>
                    <p>正在获取企业微信登录页面...</p>
                </div>
            `);
        },

        // 显示二维码错误
        showQRError(message) {
            $('#workWechatQR').html(`
                <div class="qrcode-error">
                    <i class="ace-icon fa fa-exclamation-triangle fa-2x"></i>
                    <p>${message}</p>
                    <button type="button" class="btn btn-sm btn-default" onclick="location.reload()">
                        <i class="ace-icon fa fa-refresh"></i> 重新加载
                    </button>
                </div>
            `);
        },

        // 更新提示信息
        updateTip(message, icon = 'mobile') {
            $('#qrcodeTip').html(`<i class="ace-icon fa fa-${icon}"></i><span>${message}</span>`);
        },

        // 设置按钮状态
        setButtonState($btn, state, text = '') {
            if (state === 'loading') {
                $btn.prop('disabled', true).html(`<i class="ace-icon fa fa-spinner fa-spin"></i><span>${text}</span>`);
            } else if (state === 'normal') {
                $btn.prop('disabled', false).html('<i class="ace-icon fa fa-weixin"></i><span>使用企业微信登录</span><i class="ace-icon fa fa-arrow-right"></i>');
            } else if (state === 'success') {
                $btn.hide();
            }
        },

        // 显示登录成功
        showSuccess() {
            $('#qrcodeSuccess').removeClass('hide');
            $('#qrcodeTip').addClass('hide');
        }
    };

    // ========== 登录逻辑 ==========
    const Login = {
        // 初始化
        init() {
            this.checkCallbacks();
            this.bindEvents();
            this.initDefaultMethod();
        },

        // 检查各种回调
        checkCallbacks() {
            const params = Utils.getUrlParams();

            // 优先检查 socialCode/socialState
            if (params.get('socialCode') && params.get('socialState')) {
                this.handleSocialAuthCallback(params.get('socialCode'), params.get('socialState'));
                return;
            }

            // 检查 code/state
            if (params.get('code') && params.get('state')) {
                this.handleWorkWechatCallback(params.get('code'), params.get('state'));
            }
        },

        // 绑定事件
        bindEvents() {
            // 登录方式切换
            $('.method-item').on('click', (e) => {
                const method = $(e.currentTarget).data('method');
                UI.switchMethod(method);

                if (method === 'qrcode') {
                    this.initQRCodeLogin();
                } else {
                    this.initClickLogin();
                }
            });

            // iframe事件
            $('#closeIframeBtn').on('click', () => UI.closeIframe());
            $('#workWechatIframe').on('load', () => {
                Utils.showMessage('企业微信页面加载完成');
                UI.updateTip('<strong>企业微信登录页面已就绪</strong>，请在上方页面中扫码登录', 'check-circle');
            });

            // 帮助链接
            $('#helpLink').on('click', () => $('#helpModal').modal('show'));
            $('#dingdingLink').on('click', () => {
                window.location.href = 'login.html#qrcode';
            });

            // 点击登录按钮
            $('#workWechatLoginBtn').on('click', () => this.startClickLogin());
        },

        // 初始化默认方法
        initDefaultMethod() {
            if (State.currentMethod === 'qrcode') {
                this.initQRCodeLogin();
            }
        },

        // 初始化扫码登录
        initQRCodeLogin() {
            Utils.showMessage('初始化企业微信扫码登录');
            this.resetUI();

            if (config.demo) {
                this.showDemoMode();
                return;
            }

            UI.showQRLoading();
            this.fetchWorkWechatUrl();
        },

        // 获取企业微信URL
        fetchWorkWechatUrl() {
            $.ajax({
                url: CONFIG.socialAuthCodeUrl,
                method: 'GET',
                timeout: CONFIG.loadTimeout,
                data: {
                    domain: "https://platform-erp.fanglin.vip/xlogin.html",
                },
                success: (response) => {
                    this.handleWorkWechatUrlResponse(response);
                },
                error: (xhr, status, error) => {
                    this.handleAjaxError(xhr, '获取企业微信登录URL失败');
                }
            });
        },

        // 处理企业微信URL响应
        handleWorkWechatUrlResponse(response) {
            if (!response || typeof response !== 'object') {
                UI.showQRError('服务器响应格式错误');
                return;
            }

            if (response.errorCode === 0 && response.domain) {
                const wechatUrl = response.domain;
                if (!wechatUrl.startsWith('http')) {
                    UI.showQRError('企业微信登录链接格式无效');
                    return;
                }

                try {
                    const urlObj = new URL(wechatUrl);
                    State.currentAuthCode = urlObj.searchParams.get('state');

                    // 直接使用iframe显示企业微信登录页面
                    UI.showIframe(wechatUrl);
                } catch (e) {
                    UI.showQRError('企业微信登录链接解析失败');
                }
            } else {
                UI.showQRError(response.msg || '获取企业微信登录URL失败');
            }
        },

        // 初始化点击登录
        initClickLogin() {
            Utils.showMessage('初始化企业微信点击登录');
            UI.setButtonState($('#workWechatLoginBtn'), 'normal');
        },

        // 开始点击登录
        startClickLogin() {
            if (config.demo) {
                this.simulateLogin();
                return;
            }

            UI.setButtonState($('#workWechatLoginBtn'), 'loading', '正在跳转到企业微信...');

            // 获取企业微信登录URL
            $.ajax({
                url: CONFIG.socialAuthCodeUrl,
                method: 'GET',
                timeout: CONFIG.loadTimeout,
                data: {
                    domain: "https://platform-erp.fanglin.vip/xlogin.html",
                },
                success: (response) => {
                    if (response.errorCode === 0 && response.domain) {
                        const wechatUrl = response.domain;
                        window.location.href = wechatUrl; // 直接跳转到企业微信登录页面
                    } else {
                        UI.setButtonState($('#workWechatLoginBtn'), 'normal');
                        this.showTempMessage('获取企业微信登录链接失败：' + (response.msg || '未知错误'));
                    }
                },
                error: (xhr) => {
                    UI.setButtonState($('#workWechatLoginBtn'), 'normal');
                    this.handleAjaxError(xhr, '获取企业微信登录链接失败');
                }
            });
        },

        // 处理企业微信回调
        handleWorkWechatCallback(code, state) {
            Utils.showMessage('处理企业微信登录回调', 'success');
            UI.showSuccess();

            this.setLoginCookies('workwechat_token_' + Date.now(), code, '企业微信用户');
            this.redirectToMain();
        },

        // 处理socialAuth回调
        handleSocialAuthCallback(socialCode, socialState) {
            Utils.showMessage('处理socialCode/socialState回调');
            this.showLoadingPage();

            $.ajax({
                url: CONFIG.stateAuthCodeUrl,
                method: 'POST',
                data: { socialCode, socialState },
                timeout: 15000,
                success: (response) => {
                    if (response && response.domain) {
                        window.location.replace(config.server + "/redirect.html?authentication=" +
                            response.domain.replace(/[\r\n]/g, ""));
                    } else {
                        this.showFailure('登录认证失败，响应数据无效');
                    }
                },
                error: (xhr) => {
                    this.handleAjaxError(xhr, '登录认证失败');
                }
            });
        },

        // 设置登录Cookie
        setLoginCookies(token, code, userName) {
            Utils.setCookie("authentication", token, config.timeout);
            Utils.setCookie("loginTime", new Date().getTime(), config.timeout);
            Utils.setCookie("loginType", "work_wechat", config.timeout);
            Utils.setCookie("workwechatCode", code, config.timeout);
            Utils.setCookie("userName", userName, config.timeout);
        },

        // 跳转到主页
        redirectToMain() {
            setTimeout(() => {
                window.location.href = "index.html?timestamp=" + Date.now();
            }, 2000);
        },

        // Demo模式
        showDemoMode() {
            const demoUrl = 'about:blank';
            UI.showIframe(demoUrl);

            setTimeout(() => {
                const iframeDoc = $('#workWechatIframe')[0].contentDocument;
                if (iframeDoc) {
                    iframeDoc.body.innerHTML = `
                        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                            <h2 style="color: #00D084;">企业微信登录 - Demo模式</h2>
                            <p>这是一个模拟的企业微信登录页面</p>
                            <button onclick="parent.simulateLoginSuccess()"
                                    style="padding: 10px 20px; background: #00D084; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                模拟登录成功
                            </button>
                        </div>
                    `;
                }
            }, 100);
        },

        // 重置UI
        resetUI() {
            $('#qrcodeSuccess, #qrcodeRefresh, #qrcodeScanning').addClass('hide');
            $('#qrcodeTip').removeClass('hide');
        },

        // 显示加载页面
        showLoadingPage() {
            $('body').html(`
                <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
                    <div style="text-align: center;">
                        <i class="ace-icon fa fa-spinner fa-spin fa-4x" style="color: #00D084; margin-bottom: 20px;"></i>
                        <h3 style="color: #333; margin: 0 0 10px 0;">正在处理登录认证...</h3>
                        <p style="color: #666; margin: 0;">请稍候，正在验证您的身份</p>
                    </div>
                </div>
            `);
        },

        // 显示失败页面
        showFailure(message) {
            $('body').html(`
                <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
                    <div style="text-align: center; max-width: 400px; padding: 40px; background: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <i class="ace-icon fa fa-exclamation-triangle fa-4x" style="color: #ff6b6b; margin-bottom: 20px;"></i>
                        <h3 style="color: #333; margin: 0 0 15px 0;">登录失败</h3>
                        <p style="color: #666; margin: 0 0 25px 0; line-height: 1.5;">${message}</p>
                        <button type="button" onclick="location.reload()"
                                style="background: #00D084; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 500;">
                            <i class="ace-icon fa fa-refresh"></i> 返回登录页
                        </button>
                    </div>
                </div>
            `);
        },

        // 显示临时消息
        showTempMessage(message) {
            if (!$('#tempMessage').length) {
                $('#workWechatLoginBtn').after(`
                    <div class="alert alert-warning" id="tempMessage">
                        <i class="ace-icon fa fa-info-circle"></i> ${message}
                    </div>
                `);
            }

            setTimeout(() => {
                $('#tempMessage').fadeOut(() => $(this).remove());
            }, 5000);
        },

        // 处理AJAX错误
        handleAjaxError(xhr, defaultMessage) {
            let message = defaultMessage;
            if (xhr.status === 0) {
                message = '网络连接失败，请检查网络';
            } else if (xhr.status === 404) {
                message = '接口不存在，请联系管理员';
            } else if (xhr.status === 500) {
                message = '服务器内部错误，请稍后重试';
            }

            Utils.showMessage(message, 'error');
            UI.showQRError(message);
        }
    };

    // ========== 全局函数 ==========
    window.simulateLoginSuccess = function() {
        Login.handleWorkWechatCallback('demo_code_12345', 'demo_state_67890');
    };

    // ========== 图片轮播 ==========
    const BannerSlider = {
        currentIndex: 0,
        totalSlides: 7,
        interval: null,

        init() {
            this.bindEvents();
            this.startAutoPlay();
        },

        bindEvents() {
            // 指示器点击事件
            $('.indicator').on('click', (e) => {
                const slideIndex = parseInt($(e.currentTarget).data('slide'));
                this.goToSlide(slideIndex);
                this.resetAutoPlay();
            });

            // 鼠标悬停暂停轮播
            $('.banner-slider').on('mouseenter', () => this.pauseAutoPlay());
            $('.banner-slider').on('mouseleave', () => this.startAutoPlay());
        },

        goToSlide(index) {
            // 更新图片
            $('.slide').removeClass('active');
            $('.slide').eq(index).addClass('active');

            // 更新指示器
            $('.indicator').removeClass('active');
            $('.indicator').eq(index).addClass('active');

            this.currentIndex = index;
        },

        nextSlide() {
            const nextIndex = (this.currentIndex + 1) % this.totalSlides;
            this.goToSlide(nextIndex);
        },

        prevSlide() {
            const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this.goToSlide(prevIndex);
        },

        startAutoPlay() {
            this.pauseAutoPlay(); // 先清除可能存在的定时器
            this.interval = setInterval(() => this.nextSlide(), 4000); // 4秒切换一次
        },

        pauseAutoPlay() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        },

        resetAutoPlay() {
            this.pauseAutoPlay();
            this.startAutoPlay();
        }
    };

    // ========== 初始化 ==========
    Login.init();
    BannerSlider.init();
});