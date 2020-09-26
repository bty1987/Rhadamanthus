
var planUtils = {
    bindDatePicker: function (tag, index) {
        com.datetime(tag);
    },
    bindUploadBtn: function (tag) {
        
        var uploadArgs = {
            username: "用户名",
            rnd: "加密密文",
            uploadType: 3
        }
        
        com.uploadify(tag, "上传附件", api.common.uploadOther, 'btn btn-sm btn-primary lineheight0', "*.*", uploadArgs, 1, function(data){
            0 == data.errorCode ? com.focusPage("#filePath").val(data.resUrl) : alert(data.errorMsg);
        });
    },
    bindExecuteTimeBtn: function (tag) {
    	com.datetime(tag, "time");
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
        
        com.datetime(Binputs, "date");
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