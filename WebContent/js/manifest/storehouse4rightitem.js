
var storehouseRight = (function(){

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
            var $section = $('<section></section>').addClass('clearfix');

            $section.insertAfter('div[name="infowrap"]', that.settings.wrapper);

            list && list.length && $.each(list, function(i, v){

                var $dl =  $('<div></div>').addClass('alert alert-success col-xs-2').attr("style","margin-left:2px;border-radius:5px;");
                var $input = $('<input class="ace ace-checkbox-2">').attr({"type" : "checkbox", "value" : v.shid});
                var $span = $('<span class="lbl bigger-10"></span>').text(v.name);

                $dl.append($input).append($span).appendTo($section);
            });

            //App.initUniform();
        },

        renderByUserInfo : function(_list){

            var _user = params["promissionUser"];
            
            var $wrapper = this.settings.wrapper;
            
            $('div[name="infowrap"] strong', $wrapper).html(_user.userId + " " + _user.userName);
            $('div[name="infowrap"] span', $wrapper).html(_user.currentName+ " " + _user.duty.name);

            _list.length && ($.each(_list, function(i, v){
                $('input[value="' + v.storehouse.shid + '"]', $wrapper).attr("checked",true);
            })) ;
        },

        binding : function(){
            var $wrapper = option.settings.wrapper;
            var that = this;
            com.focusPage('#subbtn', $wrapper).click(function(){
                that.saveOptionChange();
            });
            com.focusPage('#cancelbtn', $wrapper).click(function(){
                layer.closeAll();
            });
        },
        
        saveOptionChange : function(){

            var _params = {
                "user.userId" : params["promissionUser"]["userId"]
            };
            var $menus = $('input[type="checkbox"]:checked', option.settings.wrapper);
            $menus.length && $menus.each(function(i){
                _params["shids[" + i + "]"] = $(this).val();
            });
            com.post(api.inventory.updateStorehouseUser, _params, function(data){
                com.showAlert(com.info, "操作成功");
                layer.closeAll();
            });
        },
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
                
                this.renderOption(data.storehouses);
                
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
    storehouseRight.init();
});