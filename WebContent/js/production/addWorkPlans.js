var AddWorkflow = (function(){

    var option = {
        settings:{
            wrapper : null
        },
        getOptionData:function(url,params,callBack){
            com.post(url,params,function(data){
                callBack && callBack(data);
            },null,false);
        },
        renderOption : function(list){
            var that = this;
            var $section = $('<section style="margin: 20px 20px 40px 20px;"></section>').addClass('clearfix');

            $section.insertAfter('div[name="infowrap"]', that.settings.wrapper);

            list && list.length && $.each(list, function(i, v){

                var $dl =  $('<label></label>').addClass('alert alert-success checkbox col-xs-4 checker').attr("style","margin:0px 20px 10px 0px;display: inline-block;width: 20%;border-radius:5px;");
                var $input = $('<input class="ace ace-checkbox-2">').attr({"type" : "checkbox", "value" : v.wpid});
                var $span = $('<span class="lbl bigger-10" style="margin: 5px;"></span>').text(v.name);

                $dl.append($input).append($span);
                $dl.appendTo($section);

            });
        },
        binding : function(){
            var $wrapper = option.settings.wrapper;
            var that = this;
            com.focusPage('a[name="subbtn"]', $wrapper).click(function(){
                that.saveOptionChange();
            });
            com.focusPage('a[name="cancelbtn"]', $wrapper).click(function(){
                layer.closeAll();
            });

        },
        //保存多选框中的内容
        saveOptionChange : function(){

            var _params = {};
            _params["productionWorkPlan.ppid"] = com.focusPage('#addPopUp').attr("data-ppid");

            var $menus = com.focusPage('input[type="checkbox"]:checked', option.settings.wrapper);
            $menus.length && $menus.each(function(i){
                _params["productionWorkPlan.workplan.wpid"] = $(this).val();

                com.post(api.production.addProductionWorkPlan, _params, function(data){
                    layer.closeAll();
                    layer.msg("添加成功", {icon : 1}, function(){
                    });
                });
            });
        },
        init : function($wrapper){
            this.settings.wrapper = $wrapper;
        }
    };

    return {
        init : function(){
            var $addPopUp = com.focusPage('#addPopUp');
            var ppid = $addPopUp.attr('data-ppid');

            option.init(com.focusPage('div.fltree', $addPopUp));
            option.getOptionData(api.production.queryProductionWorkPlanByPpid, {"productionWorkPlan.ppid": ppid}, $.proxy(function(data){
                var usingWorkplan =[];//使用中的工序组 存放已加入工序组的wpid

                data.productionWorkPlans.length && $.each(data.productionWorkPlans,function(i,v){
                    usingWorkplan[i] = v.workplan.wpid;
                });

                this.getOptionData(api.production.queryWorkplan, {}, $.proxy(function(data){
                    var showWorkplans = [];

                    $.each(data.workplans,function(i,v){
                        if(usingWorkplan.indexOf(v.wpid) == -1){
                            showWorkplans.push(v);
                        }
                    });
                    this.renderOption(showWorkplans);
                }, option));
            }, option));

            option.binding();
        }
    };
})();

$(function(){
    AddWorkflow.init();
});
