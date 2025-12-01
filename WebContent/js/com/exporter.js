(function($) {

    $.extend({
        exceler: function(options, preFunc) {
            var defaults = {};

            var conf = $.extend(defaults, options);

            var labels = [], datas = [], types = [];
            $.each(conf.column, function(i, v) {
                labels[i] = v[0];
                datas[i] = v[1];
                types[i] = v.length > 2 ? v[2] : "text";
            });

            var list = conf.list;

            var excel = "<table>";

            // Header
            excel += "<tr>";
            $.each(labels, function(i, v) {
                excel += "<td>" + v + "</td>";
            });
            excel += '</tr>';

            // Row Vs Column
            $.each(list, function(i, v) {

                preFunc && (preFunc(v));

                excel += "<tr>";
                $.each(datas, function(index, val) {

                    var _type = types[index];

                    v._$ = "$"; // 文件压缩过程需要赋值来确定v的名称 , 否则改域内没有使用到v , 不能命名

                    var res = "";

                    if (typeof val == 'string') {
                        res = getElement(v, val.split('.'));
                    } else if ($.isArray(val)) {
                        $.each(val, function(i, item) {
                            res = res + getElement(v, item.split("."))
                        });
                    } else {
                        res = "";
                    }

                    if (_type == 'text') {
                        _type = "mso-number-format:\"@\";";
                    } else if (_type == "int") {

                    } else if (_type == "float") {

                    } else if (_type == "datetime") {

                    } else if (_type == "date") {

                    } else if (_type == "time") {

                    } else {
                        _type = "mso-number-format:\"@\";";
                    }

                    // if (typeof val != 'string') {
                    // excel += "<td style='mso-number-format:\"@\";'>" + getElement(v, val) + "</td>";
                    // } else {
                    // excel += "<td style='mso-number-format:\"@\";'>" + getElement(v, val.split('.')) + "</td>";
                    // }

                    excel += "<td style='" + _type + "'>" + res + "</td>";
                });
                excel += '</tr>';
            });

            excel += "</table>";

            var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
            excelFile += "<head>";
            excelFile += "<!--[if gte mso 9]>";
            excelFile += "<xml>";
            excelFile += "<x:ExcelWorkbook>";
            excelFile += "<x:ExcelWorksheets>";
            excelFile += "<x:ExcelWorksheet>";
            excelFile += "<x:Name>";
            excelFile += "Sheet1";
            excelFile += "</x:Name>";
            excelFile += "<x:WorksheetOptions>";
            excelFile += "<x:DisplayGridlines/>";
            excelFile += "</x:WorksheetOptions>";
            excelFile += "</x:ExcelWorksheet>";
            excelFile += "</x:ExcelWorksheets>";
            excelFile += "</x:ExcelWorkbook>";
            excelFile += "</xml>";
            excelFile += "<![endif]-->";
            excelFile += "</head>";
            excelFile += "<body>";
            excelFile += excel;
            excelFile += "</body>";
            excelFile += "</html>";
            var base64data = "base64," + Base64.encode(excelFile);
            window.open('data:application/vnd.ms-excel;filename=exportData.doc;' + base64data);
        },
        pnger: function(options) {

            var defaults = {};

            var conf = $.extend(defaults, options);

            html2canvas($("#" + conf.eId), {
                onrendered: function(canvas) {
                    var img = canvas.toDataURL("image/png");
                    window.open(img);
                }
            });
        }
    });

    function getElement(o, props) {
        var prop = props.shift();
        if (props.length == 0) {
            return (o[prop] != null || o[prop] != undefined) ? o[prop] : "";
        } else if (o[prop]) { return getElement(o[prop], props); }

        return "";
    }

    /*
     * $('#export').click(function(){ $.exceler({ column : [ ["订单编号","orderId"], ['楼盘地址',['village.villageName','houseNumber']], ['客户名','customer.customerName'], ['设计部','designDepartment'], ['设计师', 'designer'], ['监理','supervisor'], ['业务员', 'salesman'], ['面积', 'houseArea'], ], list : list, });
     * 
     * });
     */

})(jQuery);
