/**
 * 常量配置模块。
 *
 * 对外暴露两个全局：
 *   - constant         按模块组织的常量树（兼容旧 API）
 *   - Constant         构造器，提供 init / module / clazz / type / get / keyOf / valueOf / datas
 *
 * 旧调用形态（保持兼容，324 个调用点无需改动）：
 *   constant.decoration().decoration.typeness.keys[decoration.typeness]
 *   constant.data.aoodsCharge.type.datas
 *
 * 新增只读辅助 API（推荐新代码使用，语义清晰）：
 *   Constant().get(module, clazz, type)            -> { keys, values, datas }
 *   Constant().valueOf(module, clazz, type, key)   -> value（key -> 中文值）
 *   Constant().keyOf(module, clazz, type, value)   -> key （中文值 -> key）
 *   Constant().datas(module, clazz, type)          -> [{ key, value }, ...]
 */
(function(window) {

    var constant = {};

    var Constant = function() {

        // 模块数据容器：constant[module] -> { load: bool, <clazz>: {...} }
        // load 标志位用于判断该模块是否已发起过 queryConstant 请求，避免重复请求。
        var handle = function(module, clazz, type) {

            if (!module) {
                return constant;
            }

            // 确保模块容器存在。已加载过的模块直接返回，避免重复请求。
            if (!constant[module]) {
                constant[module] = {
                    "load": false
                };
            }

            if (constant[module]["load"] && !clazz && !type) {
                return constant[module];
            }

            var options = {
                "constant.status": 0
            };

            if (module) {
                options["constant.module"] = module;
            }

            if (clazz) {
                options["constant.clazz"] = clazz;
            }

            if (type) {
                options["constant.type"] = type;
            }

            com.post(api.data.queryConstant, options, function(res) {

                var constants = res.constants;

                $.each(constants, function(i, v) {

                    if (!constant[module][v.clazz]) {
                        constant[module][v.clazz] = {};
                    }

                    if (!constant[module][v.clazz][v.type]) {
                        constant[module][v.clazz][v.type] = {
                            "datas": [],
                            "keys": {},
                            "values": {}
                        };
                    }

                    if (/^\d+$/.test(v.key)) {
                        v.key = parseInt(v.key);
                    }

                    constant[module][v.clazz][v.field] = v.key;
                    constant[module][v.clazz][v.type]["keys"][v.key] = v.value;
                    constant[module][v.clazz][v.type]["values"][v.value] = v.key;

                    constant[module][v.clazz][v.type]["datas"].push({
                        "key": v.key,
                        "value": v.value
                    });
                });
            }, null, false);

            constant[module]["load"] = true;

            return constant[module];
        }

        /**
         * 取某个 type 节点的完整数据结构。
         * @return {datas:[], keys:{}, values:{}} 或 undefined（不存在时）
         */
        var get = function(module, clazz, type) {

            if (!module || !clazz || !type) {
                return undefined;
            }

            // 确保模块已加载
            handle(module);

            var node = constant[module] && constant[module][clazz] && constant[module][clazz][type];
            return node;
        }

        /**
         * key -> value（如 0 -> "启用"）。未命中返回 undefined。
         */
        var valueOf = function(module, clazz, type, key) {

            var node = get(module, clazz, type);
            return node && node.keys ? node.keys[key] : undefined;
        }

        /**
         * value -> key（如 "启用" -> 0）。未命中返回 undefined。
         */
        var keyOf = function(module, clazz, type, value) {

            var node = get(module, clazz, type);
            return node && node.values ? node.values[value] : undefined;
        }

        /**
         * 取某 type 的 datas 数组（用于 bindData 等场景）。
         */
        var datas = function(module, clazz, type) {

            var node = get(module, clazz, type);
            return node ? node.datas : [];
        }

        /**
         * 加载施工节点数据并镜像到 decoration.decoration.projectStatus。
         *
         * projectStatus 在节点列表前追加三个写死状态：
         *   0=初始 / 1=开工 / 2=完工
         * 节点数据来源于 api.data.queryConstructionNode，与 queryConstant 接口分离。
         */
        var loadConstructionNodes = function() {

            com.post(api.data.queryConstructionNode, {}, function(res) {

                var nodes = res.constructionNodes;

                var module = "data";
                var clazz = "construction";
                var type = "node";

                if (!constant[module]) {
                    constant[module] = {};
                }

                if (!constant[module][clazz]) {
                    constant[module][clazz] = {};
                }

                if (!constant[module][clazz][type]) {
                    constant[module][clazz][type] = {
                        "datas": [],
                        "keys": {},
                        "values": {}
                    };
                }

                $.each(nodes, function(i, v) {

                    constant[module][clazz][type]["keys"][v.cnid] = v.name;
                    constant[module][clazz][type]["values"][v.name] = v.cnid;

                    constant[module][clazz][type]["datas"].push({
                        "key": v.cnid,
                        "value": v.name
                    });
                });

                // 镜像到 decoration.decoration.projectStatus，前置固定状态
                if (!constant["decoration"]) {
                    constant["decoration"] = {};
                }

                if (!constant["decoration"]["decoration"]) {
                    constant["decoration"]["decoration"] = {};
                }

                constant["decoration"]["decoration"]["projectStatus"] = {
                    "keys": $.extend({
                        0: "初始",
                        1: "开工",
                        2: "完工"
                    }, constant[module][clazz][type]["keys"]),
                    "values": $.extend({
                        "初始": 0,
                        "开工": 1,
                        "完工": 2
                    }, constant[module][clazz][type]["values"]),
                    "datas": [{
                        "key": 0,
                        "value": "初始"
                    }, {
                        "key": 1,
                        "value": "开工"
                    }, {
                        "key": 2,
                        "value": "完工"
                    }].concat(constant[module][clazz][type]["datas"])
                };
            });
        }

        return {
            init: function() {

                // 将 constant 重建为按需加载的模块访问器。
                // 调用 constant.<module>() 触发首次加载并返回模块对象；后续调用直接命中缓存。
                $.each(["data", "customer", "decoration", "quotation", "construction", "salary", "sales", "payment", "information", "right", "inventory", "personel", "balance", "approval", "system", "building"], function(i, module) {

                    constant[module] = function() {
                        return handle(module);
                    };
                });

                // 施工节点独立于 queryConstant 接口，单独加载
                loadConstructionNodes();

                window.console && window.console.log && console.log("%cConstant Config Ready 常量配置就绪", "color:#0a0; font-size:1em");
            },
            module: function(module) {

                return handle(module);
            },
            clazz: function(module, clazz) {

                return handle(module, clazz);
            },
            type: function(module, clazz, type) {

                return handle(module, clazz, type);
            },
            get: get,
            valueOf: valueOf,
            keyOf: keyOf,
            datas: datas
        }
    };

    // 对外暴露：constant 作为全局变量供旧 API 访问，Constant 为构造器
    window.constant = constant;
    window.Constant = Constant;

})(window);
