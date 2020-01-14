var drawNode = {};
$(function () {

    drawNode = {
        getConfig: function (page) {

            var pageConfig = {
                "apiPage": null,
                "pageBtn": [],
                "postDataName": page + "PostData",
                "nodes": {},
                "condArr": [],
                "propertyArr": [],
                "hasExport": null
            };

            function packageConfig(o, props, value, subtype){

                var prop = props.shift();
                if(props.length != 0){
                    if(!o[prop]) o[prop] = {};
                    packageConfig(o[prop], props, value, subtype);
                    return;
                }

                if(subtype == 0){
                    o[prop] = value;
                } else if(subtype == 1 && !o[prop]){
                    o[prop] = [value];
                } else if(subtype == 1 && o[prop]){
                    o[prop].push(value);
                }
            }

            function getApi(o, props){

                var prop = props.shift();

                if(props.length == 0){
                    return o[prop];
                } else if(o[prop]){
                    return getApi(o[prop], props);
                }
                return "";
            }

            com.post(api.right.queryProductionFunctionRightByName, {"productionFunctionRight.name": page}, function (res) {

                var rights = res.productionFunctionRights.sort(function(a, b){return a.productionFunction.sort - b.productionFunction.sort;});

                $.each(rights, function (i, v) {

                    var data = v.productionFunction;

                    if(data.type == 1) data.value = getApi({"api": api}, data.value.split("."));

                    packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
                });
            }, null, false);

            return pageConfig;
        }
    };
});