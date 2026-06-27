var constructionUtils = {

    /**
     * 生成施工模块列表的公共 lineprops 起始字段块。
     * 涵盖: 装修单 / 楼盘 / 楼号 / 客户 / [设计部门] / 设计师 / 监理。
     * 各页面调用后,可用 .concat([...专属字段]) 追加业务字段。
     *
     * @param {object} opts
     * @param {string} opts.prefix          属性前缀,扁平结构传 "",嵌套结构传 "decoration."
     * @param {boolean} opts.includeDept    是否包含"设计部门"字段,默认 false
     * @param {string} opts.designerNameKey 设计师名称字段名,默认 "userName"(drawline4apply/user 传 "currentName")
     */
    makeDecorationLineProps: function(opts) {

        opts = opts || {};

        var prefix = opts.prefix || "";
        var includeDept = opts.includeDept !== false;
        var designerNameKey = opts.designerNameKey || "userName";

        var props = [{
            field: prefix + "orderId",
            name: "装修单",
            prop: prefix + "orderId",
            clazz: "blue",
            click: function(btn, v) {
                tools.decoration.info(btn, v[prefix + "orderId"]);
            }
        }, {
            field: prefix + "house.village.name",
            name: "楼盘",
            prop: prefix + "house.village.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.house.info(btn, v[prefix + "house"].hid);
            }
        }, {
            field: prefix + "house.houseNumber",
            name: "楼号",
            prop: prefix + "house.houseNumber",
            clazz: "grey"
        }, {
            field: prefix + "customer.name",
            name: "客户",
            prop: prefix + "customer.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.customer.info(btn, v[prefix + "customer"].cid);
            }
        }];

        if (includeDept) {
            props.push({
                field: prefix + "designer.dept.name",
                name: "设计部门",
                prop: prefix + "designer.dept.name",
                clazz: "grey",
                click: function(btn, v) {
                    tools.department.info(btn, v[prefix + "designer"].dept.did);
                }
            });
        }

        props.push({
            field: prefix + "designer." + designerNameKey,
            name: "设计师",
            prop: prefix + "designer." + designerNameKey,
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v[prefix + "designer"].userId);
            }
        }, {
            field: prefix + "supervisor.userName",
            name: "监理",
            prop: function(v) {
                var supervisor = v[prefix + "supervisor"];
                return supervisor ? supervisor.userName : "";
            },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v[prefix + "supervisor"].userId);
            }
        });

        return props;
    }
};
