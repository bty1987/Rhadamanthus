var constant = {

};

var Constant = function() {

    var handle = function(module, clazz, type) {

        if (!constant[module]) {
            constant[module] = {
                "load": true
            };

            constant[module] = function() {

                return handle(module);
            }
        }

        if (constant[module]["load"] && !clazz && !type)
            return constant[module];

        var options = {
            "constant.status": 0
        }

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

                var module = v.module;

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

                if (/^\d+$/.test(v.key))
                    v.key = parseInt(v.key)

                constant[module][v.clazz][v.field] = v.key;
                constant[module][v.clazz][v.type]["keys"][v.key] = v.value;
                constant[module][v.clazz][v.type]["values"][v.value] = v.key;

                constant[module][v.clazz][v.type]["datas"].push({
                    "key": v.key,
                    "value": v.value
                });
            });
        }, null, false);

        if (!constant[module]["load"])
            constant[module]["load"] = true;

        return constant[module];
    }

    return {
        init: function() {

            constant = {
                data: function() {

                    return handle("data");
                },
                customer: function() {

                    return handle("customer");
                },
                decoration: function() {

                    return handle("decoration");
                },
                quotation: function() {

                    return handle("quotation");
                },
                construction: function() {

                    return handle("construction");
                },
                salary: function() {

                    return handle("salary");
                },
                sales: function() {

                    return handle("sales");
                },
                payment: function() {

                    return handle("payment");
                },
                information: function() {

                    return handle("information");
                },
                right: function() {

                    return handle("right");
                },
                inventory: function() {

                    return handle("inventory");
                },
                personel: function() {

                    return handle("personel");
                },
                balance: function() {

                    return handle("balance");
                },
            };

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
                    }].concat(constant[module][clazz][type]["datas"]),
                }

            });

            window.console && window.console.log && console.log("%cConstant Config Ready 常量配置就绪", "color:#0a0; font-size:1em");

        },
        module: function(module) {

            handle(module);
        },
        clazz: function(module, clazz) {

            handle(module, clazz);
        },
        type: function(module, clazz, type) {

            handle(module, clazz, type);
        },
    }
};
