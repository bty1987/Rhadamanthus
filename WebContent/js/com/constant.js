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

        // 预置模块清单：init() 重建访问器、preload() 并发预取，均以此为准。
        var MODULES = ["data", "customer", "decoration", "quotation", "construction", "salary", "sales", "payment", "information", "right", "inventory", "personel", "balance", "approval", "system", "building"];

        // 模块数据容器：constant[module] -> { load: bool, <clazz>: {...} }
        // load 标志位用于判断该模块是否已发起过 queryConstant 请求，避免重复请求。
        //
        // opts.async（默认 false）：
        //   false - 同步请求，请求返回前阻塞主线程。业务侧"用完立即取值"的旧调用形态依赖此行为，
        //           故保持默认值不变以兼容 3000+ 调用点。
        //   true  - 异步预取，不阻塞 UI。用于菜单点击/登录后等"提前加载"场景，让后续业务访问命中缓存。
        //           异步预取期间若业务侧同步访问，会命中 load=true 的同步返回分支拿到未填满对象，
        //           因此 async:true 仅用于"确定业务尚未访问该模块"的预加载时机。
        var handle = function(module, clazz, type, opts) {

            if (!module) {
                return constant;
            }

            opts = opts || {};

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

            // asyncFlag 透传给 com.post：false=同步（默认，兼容旧调用），true=异步（预取不阻塞 UI）。
            // 见 core.js:167-172：asyncFlag 传 undefined/true 走异步，传 false 走同步。
            var asyncFlag = opts.async === true ? true : false;

            com.post(api.data.queryConstant, options, function(res) {

                var constants = res.constants;

                var touched = {};

                $.each(constants, function(i, v) {

                    if (!constant[module][v.clazz]) {
                        constant[module][v.clazz] = {};
                    }

                    // 每个(clazz,type)节点整体重建(非追加): 失败重试/并发双发时datas不翻倍。
                    // 🔴只重建queryConstant响应管辖的节点——其他机制写入同节点的镜像
                    //   (如loadConstructionNodes写入的decoration.projectStatus施工节点镜像)
                    //   不在响应内,不得清除(decoration.js:777等直接读镜像.keys)。
                    var nodeId = v.clazz + "/" + v.type;

                    if (!touched[nodeId]) {
                        touched[nodeId] = true;
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

                // 🔴仅在成功回调置位: 失败(会话失效110000/110005/网络错等)不进本回调,
                // load保持false, 下次访问自动重试——否则模块被永久污染(空字典+load=true),
                // 只能整框重载(重新登录)恢复。
                constant[module]["load"] = true;
            }, null, asyncFlag);

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
         *
         * opts.async（默认 false=同步）：
         *   init() 必须用同步，否则节点回调可能在访问器重建后才返回，
         *   把旧公司数据写进新公司的 constant.data.construction.node（公司隔离 bug）。
         *   节点数据量小、单次请求，同步阻塞可控。
         */
        var loadConstructionNodes = function(opts) {

            opts = opts || {};

            // asyncFlag 透传：默认同步（false），保证切公司时数据就绪后再重建访问器。
            var asyncFlag = opts.async === true ? true : false;

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

                // 镜像到 decoration.decoration.projectStatus，前置固定状态：
                //   0=初始 / 1=开工 / 2=完工，再拼接节点数据。
                // 注意：init() 同步调用时此处 constant["decoration"] 已被重建为访问器函数，
                //       故镜像写进函数对象的 decoration.projectStatus 属性，供 constant.decoration().decoration.projectStatus 读取。
                //       handle("decoration") 首次拉取时不会覆盖该镜像（queryConstant 不含 projectStatus 类型）。
                if (!constant["decoration"]) {
                    constant["decoration"] = {};
                }

                if (!constant["decoration"]["decoration"]) {
                    constant["decoration"]["decoration"] = {};
                }

                var nodeData = constant[module][clazz][type];

                constant["decoration"]["decoration"]["projectStatus"] = {
                    "keys": $.extend({
                        0: "初始",
                        1: "开工",
                        2: "完工"
                    }, nodeData["keys"]),
                    "values": $.extend({
                        "初始": 0,
                        "开工": 1,
                        "完工": 2
                    }, nodeData["values"]),
                    "datas": [{
                        "key": 0,
                        "value": "初始"
                    }, {
                        "key": 1,
                        "value": "开工"
                    }, {
                        "key": 2,
                        "value": "完工"
                    }].concat(nodeData["datas"])
                };
            }, null, asyncFlag);
        }

        return {
            init: function() {

                // 将 constant 重建为按需加载的模块访问器。
                // 重建会丢弃旧的数据对象（含上一家公司缓存），实现切公司失效。
                // 新访问器函数无 "load" 标志，handle() 首次访问会重新拉取当前公司数据。
                $.each(MODULES, function(i, module) {

                    constant[module] = function() {
                        return handle(module);
                    };
                });

                // 施工节点独立于 queryConstant 接口，单独加载。
                // 必须同步：切公司场景下，若异步回调在访问器重建后才返回，
                // 会把上一家公司节点数据写进新公司的 constant.data.construction.node（公司隔离 bug）。
                loadConstructionNodes({ async: false });

                window.console && window.console.log && console.log("%cConstant Config Ready 常量配置就绪", "color:#0a0; font-size:1em");
            },
            /**
             * 并发异步预取所有模块常量。
             *
             * 用途：登录后/切公司后调用，在用户点击菜单进入业务页面之前，把 16 个模块的常量
             *      并发异步拉到内存。配合菜单点击时的 module() 预取（index.js），让业务页面
             *      真正访问 constant.<module>() 时大概率命中 load=true 的同步缓存分支，零阻塞。
             *
             * 安全前提：调用时机必须在业务页面加载之前（如登录回调末尾）。异步预取期间
             *           load 标志已置位但数据可能尚未填满，此时同步访问会拿到未填满对象，
             *           故仅用于"确定业务尚未访问该模块"的窗口。
             *
             * @param opts.modules 可选，指定要预取的模块子集；默认全部 MODULES
             */
            preload: function(opts) {

                opts = opts || {};

                var modules = opts.modules || MODULES;

                $.each(modules, function(i, module) {
                    handle(module, null, null, { async: true });
                });
            },
            module: function(module, opts) {

                return handle(module, null, null, opts);
            },
            clazz: function(module, clazz, opts) {

                return handle(module, clazz, null, opts);
            },
            type: function(module, clazz, type, opts) {

                return handle(module, clazz, type, opts);
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
