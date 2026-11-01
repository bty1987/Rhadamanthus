/**
 * e签宝流程模板免登落点页脚本(创建/编辑双模式, 页面以 contract4esign.init('create'|'edit') 启动)。
 *
 * <p>承载形态: 服务端 querySignTemplateCreateUrl / querySignTemplateEditUrl 的 redirectUrl 跳入,
 * 在合同模板页弹出的同源 iframe 内独立运行(无 com 框架, 仅 jQuery + 直连 .do)。
 *
 * <p>对 parent(合同模板页) 的两处同源依赖, 均缺失时页面降级可手工操作:
 * <ul>
 * <li>params.authentication —— CommonInterceptor 硬校验 authentication 参数(不走 session), 由 parent 桥接供给</li>
 * <li>contractEsignBridge.context() —— 预填弹窗已填的名称/标题/页面/业务类型; done() —— 收窗并刷新列表</li>
 * </ul>
 *
 * <p>流程模板ID回传: e签宝在 redirectUrl 上拼接 signTemplateId(参数名以 signTemplateId 优先,
 * 兜底扫描 32 位 hex 形态值), 识别失败时 ID 栏开放手工填写。
 */
var contract4esign = {

    mode: null,

    authentication: null,

    signTemplateId: null,

    init: function(mode) {

        this.mode = mode;

        this.bind();

        try {
            this.authentication = parent.params && parent.params.authentication ? parent.params.authentication : null;
        } catch (e) {
            this.authentication = null;
        }

        if (!this.authentication) {
            return this.fail("未获取到登录凭证, 请从 数据管理→合同模板 页进入");
        }

        $("#tplId").removeAttr("readonly");

        this.signTemplateId = this.parseSignTemplateId();

        if (this.signTemplateId) {
            $("#tplId").val(this.signTemplateId);
        }

        if (this.mode == "create") {

            this.loadDicts();

        } else {

            $("#editPanel").show();

            if (this.signTemplateId) {
                this.enable();
            }
        }
    },

    parseSignTemplateId: function() {

        var search = window.location.search.substring(1);

        if (!search) {
            return null;
        }

        var pairs = search.split("&");

        for (var i = 0; i < pairs.length; i++) {

            var kv = pairs[i].split("=");

            var key = decodeURIComponent(kv[0] || "");
            var value = decodeURIComponent(kv[1] || "");

            if (key == "signTemplateId" && value) {
                return value;
            }

            if (/^[0-9a-f]{32}$/i.test(value)) {
                return value;
            }
        }

        return null;
    },

    loadDicts: function() {

        var self = this;

        $.post("../../queryConstant.do", {
            "authentication": this.authentication,
            "constant.module": "data",
            "constant.status": 0
        }, function(res) {

            if (!res || res.errorCode != 0) {
                return self.fail((res && res.errorMsg) ? res.errorMsg : "字典加载失败");
            }

            var atttypes = [], pages = [];

            $.each(res.constants || [], function(i, v) {

                if (v.clazz != "contract") {
                    return;
                }

                if (v.type == "atttype") {
                    atttypes.push(v);
                }

                if (v.type == "type") {
                    pages.push(v);
                }
            });

            pages.sort(function(a, b) {
                return a.key < b.key ? -1 : 1;
            });

            self.fillSelect("#atttype", atttypes);
            self.fillSelect("#page", pages);

            self.prefill();

            $("#createForm").show();

        }, "json").fail(function() {
            self.fail("字典加载失败, 请刷新重试");
        });
    },

    fillSelect: function(selector, datas) {

        var select = $(selector);

        $.each(datas, function(i, v) {
            select.append($("<option/>").val(v.key).text(v.value));
        });
    },

    prefill: function() {

        var context = null;

        try {
            context = parent.contractEsignBridge && parent.contractEsignBridge.context ? parent.contractEsignBridge.context() : null;
        } catch (e) {
        }

        if (!context) {
            return;
        }

        if (context.name) {
            $("#name").val(context.name);
        }

        if (context.title) {
            $("#title").val(context.title);
        }

        if (context.page) {
            $("#page").val(context.page);
        }

        if (context.atttype) {
            $("#atttype").val(context.atttype);
        }
    },

    save: function() {

        var self = this;

        var tplId = $.trim($("#tplId").val());
        var name = $.trim($("#name").val());
        var title = $.trim($("#title").val());
        var page = $("#page").val();
        var atttype = $("#atttype").val();

        if (!tplId) return this.tip("流程模板ID不能为空");
        if (!name) return this.tip("名称不能为空");
        if (!title) return this.tip("标题不能为空");
        if (!page) return this.tip("请选择页面");
        if (!atttype) return this.tip("请选择业务类型");

        $.post("../../addContract.do", {
            "authentication": this.authentication,
            "contract.no": tplId,
            "contract.name": name,
            "contract.title": title,
            "contract.page": page,
            "contract.path": "esign://docTemplate",
            "contract.videopath": "esign://docTemplate",
            "contract.noticePath": "",
            "contract.url": "esign://docTemplate",
            "contract.atttype": atttype
        }, function(res) {

            if (!res || res.errorCode != 0) {
                return self.tip((res && res.errorMsg) ? res.errorMsg : "保存失败, 请重试");
            }

            $("#createForm").hide();
            $("#okBox").show();

        }, "json").fail(function() {
            self.tip("请求失败, 请重试");
        });
    },

    // 编辑落点: 编辑完成自动重新开启(官方流程 停用→编辑→开启); 中途放弃编辑的恢复 = 回合同模板页重走编辑
    enable: function() {

        var self = this;

        var tplId = $.trim($("#tplId").val());

        if (!tplId) {
            return this.tip("流程模板ID不能为空");
        }

        $("#enableState").text("模板开启中...");

        $.post("../../enableSignTemplate.do", {
            "authentication": this.authentication,
            "signTemplateId": tplId
        }, function(res) {

            if (!res || res.errorCode != 0) {
                $("#enableState").html('<span style="color:#d9534f;">开启失败: ' + ((res && res.errorMsg) || "未知错误") + '</span>');
                return;
            }

            $("#enableState").html('<span style="color:#5cb85c;">模板已重新开启, 可正常发起签署</span>');

        }, "json").fail(function() {
            $("#enableState").html('<span style="color:#d9534f;">请求失败, 请重试</span>');
        });
    },

    done: function() {

        try {
            if (parent.contractEsignBridge && parent.contractEsignBridge.done) {
                parent.contractEsignBridge.done();
                return;
            }
        } catch (e) {
        }

        alert("操作完成, 请关闭本窗口并刷新合同模板列表");
    },

    copyTplId: function() {

        $("#tplId").select();

        try {
            document.execCommand("copy");
        } catch (e) {
        }
    },

    bind: function() {

        var self = this;

        $("#copyBtn").on('click', function() {
            self.copyTplId();
        });

        $("#saveBtn").on('click', function() {
            self.save();
        });

        $("#doneBtn").on('click', function() {
            self.done();
        });

        $("#enableRetryBtn").on('click', function() {
            self.enable();
        });
    },

    fail: function(message) {
        $("#errBox").text(message).show();
    },

    tip: function(message) {
        $("#tipBox").text(message).show();
    }

};
