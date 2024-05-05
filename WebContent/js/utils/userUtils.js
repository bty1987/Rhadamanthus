var userUtils = {
    getConfig: function(page) {

        var pageConfig = {
            "apiPage": null,
            "pageBtn": [],
            "condArr": [],
            "extraParam": [],
            "propertyArr": []
        };

        function packageConfig(o, props, value, subtype) {

            var prop = props.shift();
            if (props.length != 0) {
                if (!o[prop])
                    o[prop] = {};
                packageConfig(o[prop], props, value, subtype);
                return;
            }

            if (subtype == 0) {
                o[prop] = value;
            } else if (subtype == 1 && !o[prop]) {
                o[prop] = [value];
            } else if (subtype == 1 && o[prop]) {
                o[prop].push(value);
            }
        }

        function getApi(o, props) {

            var prop = props.shift();

            if (props.length == 0) {
                return o[prop];
            } else if (o[prop]) {
                return getApi(o[prop], props);
            }
            return "";
        }

        com.post(api.right.queryUserFunctionRight, {"userFunctionRight.name": page}, function(res) {

            var rights = res.userFunctionRights.sort(function(a, b) {

                return a.userFunction.sort - b.userFunction.sort;
            });

            $.each(rights, function(i, v) {

                var data = v.userFunction;

                if (data.type == 1)
                    data.value = getApi({
                        "api": api
                    }, data.value.split("."));

                packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
            });
        }, null, false);

        return pageConfig;
    },
    getPropertyArr: function(propertyArr, v) {

        var propertyArray = [];
        $.each(propertyArr, function(pi, pv) {

            switch (pv) {
                case "userId":
                    propertyArray.push(["员工编号:", v.userId, "grey"]);
                    break;
                case "loginId":
                    propertyArray.push(["用户名:", v.loginId, "grey"]);
                    break;
                case "dept":
                    propertyArray.push(["部门:", v.dept.name, "grey"]);
                    break;
                case "duty":
                    propertyArray.push(["职位:", v.duty.name, "grey"]);
                    break;
                case "role":
                    propertyArray.push(["角色:", v.role.name, "grey"]);
                    break;
                case "phone":
                    propertyArray.push(["联系方式:", v.phone, "grey"]);
                    break;
                case "identity":
                    propertyArray.push(["身份证:", v.identity.replace(/(\d{6})\d{8}(\w{4})/, '$1********$2'), "grey"]);
                    break;
                case "status":
                    propertyArray.push(["状态:", constant.personel().user.status.keys[v.status], "red"]);
                    break;
            }
        });
        return propertyArray;
    }

};