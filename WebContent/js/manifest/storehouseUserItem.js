
var OptionManagement = (function(){

    var option = {
        settings : {
            wrapper : null
        },
        getOptionData : function(url, params, callBack){
            com.post(url, params, function(data){
                callBack && callBack(data);
            }, null, true);
        },
        renderOption : function(list){

            var that = this;
            var $section = $('<section style="margin: 20px 20px 40px 20px;"></section>').addClass('clearfix');

            $section.insertAfter('div[name="infowrap"]', that.settings.wrapper);

            list && list.length && $.each(list, function(i, v){

                var $dl =  $('<label></label>').addClass('alert alert-success checkbox col-xs-4 checker').attr("style","margin:0px 20px 10px 0px;display: inline-block;width: 20%;border-radius:5px;");
                $input = $('<input class="ace ace-checkbox-2">').attr({"type" : "checkbox", "value" : v.shId});
                $span = $('<span class="lbl bigger-10" style="margin: 5px;"></span>').text(v.name);

                $dl.append($input).append($span);
                $dl.appendTo($section);

            });

            //App.initUniform();


        },



        renderByUserInfo : function(_list){

            var _user = params["promissionUser"];
            var $wrapper = this.settings.wrapper;
            $('div[name="infowrap"] strong', $wrapper).html(_user.userId + " " + _user.userName);
            $('div[name="infowrap"] span', $wrapper).html(_user.currentName+ " " + _user.duty.name);


            _list.length && ($.each(_list, function(i, v){
                $('input[value="' + v.storehouse.shId + '"]', $wrapper).attr("checked",true);
            })) ;//, jQuery.uniform.update()
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

            var _params = {
                "user.userId" : params["promissionUser"]["userId"]
            };
            var $menus = $('input[type="checkbox"]:checked', option.settings.wrapper);
            $menus.length && $menus.each(function(i){
                _params["shIds[" + i + "]"] = $(this).val();
            });
            com.post(api.inventory.updateStorehouseUser, _params, function(data){
                layer.closeAll();
                layer.msg("设置成功", {icon : 1}, function(){

                });
            });
        }
        ,
        init : function($wrapper){
            this.settings.wrapper = $wrapper;
        }
    };

    return {
        init : function(){
            var $optPopUp = com.focusPage('#optPopUp');
            var userId = $optPopUp.attr('data-userId');
            option.init($('div.fltree', $optPopUp));
            option.getOptionData(api.inventory.queryStorehouse, {}, $.proxy(function(data){
                var storehousesStatus = [];
                $.each(data.storehouses,function(i,v){
                    if(v.status==0){
                        storehousesStatus.push(v);
                    }
                });
                this.renderOption(storehousesStatus);
                this.getOptionData(api.inventory.queryStorehouseUserByUserId, {
                    "user.userId": userId
                }, $.proxy(function(data){
                    this.renderByUserInfo(data.storehouseUsers);
                }, option));

            }, option));

            option.binding();
        }
    };
})();


$(function(){
    OptionManagement.init();
});