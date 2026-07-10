var constructionPage = {};
$(function () {
    constructionPage = {
        // 依据页面名(及当前公司)返回前端页面配置对象
        // 与 salesPageUtils.drawNode.getConfig / paymentUtils.getConfig 机制一致
        // 返回: { apiPage, pageBtn[], condArr[], propertyArr[] }
        getConfig: function (page) {

            var pageConfig = {
                "apiPage": null,
                "pageBtn": [],
                "condArr": [],
                "propertyArr": []
            };

            function packageConfig(o, props, value, subtype) {

                var prop = props.shift();
                if (props.length != 0) {
                    if (!o[prop]) o[prop] = {};
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

            com.post(api.right.queryConstructionFunctionRightByName, { "constructionFunctionRight.name": page }, function (res) {

                var rights = res.constructionFunctionRights.sort(function (a, b) { return a.constructionFunction.sort - b.constructionFunction.sort; });

                $.each(rights, function (i, v) {

                    var data = v.constructionFunction;

                    if (data.type == 1) data.value = getApi({ "api": api }, data.value.split("."));

                    packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
                });
            }, null, false);

            return pageConfig;

        }
    };
});
