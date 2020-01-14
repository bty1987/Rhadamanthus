$(function(){

    function binding (){
        com.focusPage("#subbtn").click(function(){
            saveOptionChange();
        });
        com.focusPage("#cancelbtn").click(function(){
            com.closePopup();
        });

    }

    com.post(api.production.queryProductionWorkPlanByPpid, {"productionWorkPlan.ppid": params.ppid}, function(data){
        var usingWorkplan = [];

        data.productionWorkPlans.length && $.each(data.productionWorkPlans,function(i,v){
            if(v.status != 3) {
                usingWorkplan[i] = v.workplan.wpid;
            }
        });

        com.post(api.production.queryWorkplan, {}, function(data){
            var showWorkplans = [];

            $.each(data.workplans,function(i,v){
                if(usingWorkplan.indexOf(v.wpid) == -1){
                    showWorkplans.push(v);
                }
            });

            renderOption(showWorkplans);
        });

        binding();
    });

    function renderOption (list){

        var $section = $('<section style="margin: 20px 20px 40px 20px;"></section>').addClass('clearfix');

        $section.insertAfter("#addWorkPlansModal");
        list && list.length && $.each(list, function(i, v){

            var $dl =  $('<label></label>').addClass('alert alert-success checkbox col-xs-4 checker').attr("style","margin:0px 20px 10px 0px;display: inline-block;width: 20%;border-radius:5px;");
            var $input = $('<input class="ace ace-checkbox-2">').attr({"type" : "checkbox", "value" : v.wpid});
            var $span = $('<span class="lbl bigger-10" style="margin: 5px;"></span>').text(v.name);

            $dl.append($input).append($span);
            $dl.appendTo($section);

        });
    }

    function saveOptionChange(){
        var _params = {
            "productionWorkPlan.ppid": params.ppid
        };

        var $menus = com.focusPage('input[type="checkbox"]:checked');
        $menus.length && $menus.each(function(){
            _params["productionWorkPlan.workplan.wpid"] = $(this).val();
            com.post(api.production.addProductionWorkPlan, _params, function(){
                com.showAlert(com.info, "操作成功");
                com.closePopup();
                com.switchPage(api.index.productionPlanDetailIndex.url);
            });
        });
    }
});