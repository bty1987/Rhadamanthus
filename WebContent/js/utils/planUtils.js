/**
 * Created by Administrator on 2018/9/21.
 */
var planUtils = {
    bindDatePicker: function (tag, index) {
        com.focusPage(tag).datepicker(com.datepickerdefault).on("show", function () {
            setTimeout(function () {
                $(".dropdown-menu").css("z-index", index);
            }, 0);
        }).next().on(ace.click_event, function () {
            a(this).prev().focus();
        });
    },
    bindUploadBtn: function (tag) {
        com.focusPage(tag).Huploadify({
            auto: !0,
            successTimeout: 99999,
            formData: {
                username: "用户名",
                rnd: "加密密文",
                uploadType: 3
            },
            buttonText: "上传附件",
            buttonClass: "btn btn-sm btn-primary lineheight0",
            overrideEvents: ["onDialogClose"],
            fileObjName: "strutsUploads",
            uploader: config.media + api.common.uploadOther.url,
            width: "78",
            onSelectError: function (a, b, c) {
                switch (b) {
                    case -100:
                        alert("上传的文件数量已经超出系统限制的" + com.focusPage("#file_upload").uploadify("settings", "queueSizeLimit") + "个文件!");
                        break;
                    case -110:
                        alert("文件 [" + a.name + "] 大小超出系统限制的" + com.focusPage("#file_upload").uploadify("settings", "fileSizeLimit") + "大小!");
                        break;
                    case -120:
                        alert("文件 [" + a.name + "] 大小异常");
                        break;
                    case -130:
                        alert("文件 [" + a.name + "] 类型不正确");
                }
            },
            onUploadSuccess: function (a, b, c) {
                a = eval("(" + b + ")");
                0 == a.errorCode ? com.focusPage("#filePath").val(a.resUrl) : alert(b);
            },
            itemTemplate: '<div id="${fileID}" class="uploadify-queue-item" style="position:absolute;top:-30px;width:200px;left:-200px;">\r\n\t\t\t<div class="cancel">\r\n\t\t\t\t<a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">X</a>\r\n\t\t\t</div>\r\n\t\t\t<span class="fileName">${fileName} (${fileSize})</span><span class="data"></span>\r\n\t\t\t<div class="uploadify-progress">\r\n\t\t\t\t<div class="uploadify-progress-bar"><!--Progress Bar--></div>\r\n\t\t\t</div>\r\n\t\t</div>'
        });
    },
    bindDateRangePicker: function (tag, index) {
        com.focusPage(tag).on("focus", function (e) {
            $(".dropdown-menu").css("z-index", index);
        }).daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function () {
            $(this).next().focus();
        });
    },
    
    bindExecuteTimeBtn: function (tag) {
    	com.focusPage(tag).timepicker(com.timepickerdefault);
    },
    
    TimeComparison: function (executeTime, m) {
        var curTime = new Date();
        curTime.setTime(curTime.setMinutes(curTime.getMinutes() + m));
        if (executeTime > curTime) {
            return true;
        } else {
            return false;
        }
    },

    PluginsA: function (ida) {
        var Adivs = $('<div></div>').addClass('form-group').attr('id', "dateRange");
        var Alabels = $('<label>时间区间</label>').addClass('col-sm-3 control-label no-padding-right').attr('for', "id"+ida);
        var Adivn = $('<div></div>').addClass('col-sm-9');
        var Ainputs = $('<input />').addClass('col-xs-10 col-sm-5').attr("name", "date-range-picker").attr("id","id"+ida).attr("type", "text").attr("readonly", "readonly");
        var plugins = com.focusPage("#pluginss");
        Adivn.append(Ainputs);
        Adivs.append(Alabels).append(Adivn);
        Adivs.appendTo(plugins);

        com.datetime(Ainputs, "date", true);
    },
    PluginsB: function (ida) {
        var Bdivs = $('<div></div>').addClass('form-group').attr('id',"mothRange");
        var Blabels = $('<label>月份区间</label>').addClass('col-sm-3 control-label no-padding-right').attr('for', "id"+ida);
        var Bdivn = $('<div></div>').addClass('col-sm-9');
        var Binputs = $('<input />').addClass('col-xs-10 col-sm-5').attr("name", "date-range-picker").attr("id", "id"+ida).attr("type", "text").attr("readonly", "readonly");

        var plugins = com.focusPage("#pluginss");
        Bdivn.append(Binputs);
        Bdivs.append(Blabels).append(Bdivn);
        Bdivs.appendTo(plugins);

        planUtils.bindDateRangePicker("#"+"id"+ida, 1070);
    },
    PluginsC: function (ida) {
        var Cdivs = $('<div></div>').addClass('form-group').attr('id',"hupload");

        var Clabels = $('<label>上传附件</label>').addClass('col-sm-3 control-label no-padding-right').attr('for', "attachment");
        var Cdivn = $('<div></div>').addClass('col-sm-3 col-xs-4');
        var Cdivns = $('<div></div>').attr("id", "attachment");
        var Cinputs = $('<input />').addClass('hidden').attr("id", "filePath").attr("type", "text");

        var plugins = com.focusPage("#pluginss");
        Cdivn.append(Cinputs);
        Cdivs.append(Clabels).append(Cdivn);
        Cdivn.append(Cdivns);
        Cdivs.appendTo(plugins);

        planUtils.bindUploadBtn("#attachment", 1070);
    },
    PluginsD: function (ida) {
        var Ddivs = $('<div></div>').addClass('form-group').attr('id', "commont");
        var Dlabels = $('<label>参数</label>').addClass('col-sm-3 control-label no-padding-right').attr('for', "id"+ida);
        var Ddivn = $('<div></div>').addClass('col-sm-9');
        var Dinputs = $('<input />').addClass('col-xs-10 col-sm-5').attr("id", "id"+ida).attr("type", "text").attr("maxlength", "60");

        var plugins = com.focusPage("#pluginss");
        Ddivn.append(Dinputs);
        Ddivs.append(Dlabels).append(Ddivn);
        Ddivs.appendTo(plugins);
    }
};