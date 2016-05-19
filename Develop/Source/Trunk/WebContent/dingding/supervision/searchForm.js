var Supervision = (function(){

    var supervision = {
        $input: null,
        authentication : "",
        searchConf : {
            village : {
                placeholder : "请输入楼盘",
                path : config.serverHost + "queryVillageForNameByPinyin.do",
            },
            designer : {
                placeholder : "请输入设计师",
                path : config.serverHost + "queryUserForNameByDuty.do",
                params : {
                    "duty" : "设计师"
                }
            }
        },
    };

    //各种事件绑定
    var binding = {

        openAutofill : function(){
            var that = this;
            //data-path="queryVillageForNameByPinyin.do"
            $('#router3 input.village, #router3 input.designer').on('click', function(e){

                var _flag = $(this).attr('class');
                supervision.$input = $(this);
                $('.list-block ul', '#search-panel').empty();
                that.openPanel(supervision["searchConf"][_flag]["placeholder"], _flag);
            });
        },
        /*
        * msg:placeholder提示
        * */
        openPanel : function(msg, flag){
            var pannel = $('#search-panel');
            var isopen = $.openPanel(pannel);
            $('#search').val(null).attr({"placeholder" : msg, "data-flag" : flag});
            return isopen;
        },

        bindAutofill : function(){

            $('#search').on('input', function(){

                var $li;
                var _flag = $(this).attr('data-flag');
                var _value = $(this).val();
                var _params = {"authentication": supervision["authentication"],"pinyinName" : _value};
                $('.list-block ul', '#search-panel').empty();

                $.ajax({
                    type: 'POST',
                    url: supervision["searchConf"][_flag]["path"],
                    data: !supervision["searchConf"][_flag]["params"] ? _params : $.extend(true, {}, supervision["searchConf"][_flag]["params"], _params),
                    dataType : "json",
                    success: function(res){
                        res.autoFillList && res.autoFillList.length && $.each(res.autoFillList, function(i, v){
                            var $li = painter.createItem(v);
                            $('.list-block ul', '#search-panel').append($li);
                        });

                    },error: function (xhr, errorType, error) {
                        dd.device.notification.alert({
                            message: "错误" + error + errorType,
                            title: "提示",
                            buttonName: "确认",
                        });
                    }

                });

            });
        },
        //表单提交
        bindSearch : function(){
            $('#subform').on('click', function(){
                var params = [];
                var _link = "orderList.html?authentication=" + supervision.authentication;
                var _oid, _villa, _hnum, _ds;
                _oid = $('input.orderid', '#router3').val();
                _villa = $('input.village', '#router3').val();
                _hnum = $('input.housenumber', '#router3').val();
                _ds = $('input.designer', '#router3').val();

                _oid && _oid.trim() && (params.push(["orderId",_oid.trim(), "eq"]));
                _villa && _villa.trim() &&(params.push(["village",_villa.trim(), "cn"]));
                _hnum && _hnum.trim() &&(params.push(["houseNumber",_hnum.trim(), "cn"]));
                _ds && _ds.trim() &&(params.push(["designer",_ds.trim(), "cn"]));

                params.length ? (
                    _link += "?",
                    $.each(params, function(i, v){
                        _link += '&filters[' + i + '].data=' + v[1] ;
                        _link += '&filters[' + i + '].field=' + v[0]
                        _link += '&filters[' + i + '].op=' + v[2]
                    }),
                    window.location.href = encodeURI(_link)
                ) : dd.device.notification.alert({
                    message: "请填写搜索条件",
                    title: "提示",
                    buttonName: "确认",
                });
            });
        },

        init : function(){
            this.openAutofill();
            this.bindAutofill();
            this.bindSearch();
        }
    };

    var painter = {
        createItem : function(v){
            var $li = $('<li></li>').addClass('item-content');
            var $content = $('<div></div>').addClass('item-inner');
            var $val = $('<div></div>').addClass('item-title').html(v);
            $content.append($val).appendTo($li);
            $li.on('click', function(){
                var _val = $(this).find('.item-title').html();
                supervision.$input.val(_val);
                $.closePanel('#search-panel');
            });
            return $li;
        }
    };

    return {
        init : function(authentication){
            supervision.authentication = authentication;
            binding.init();
        }
    };
})();


$(function(){

    $.init();
    var $input;

    var isPanelOpen = false;

    $('#search-panel').on('open',function(e){
        $('#search').focus();
    });

    /*--------------------*/
    var supervision = {

        hostAddr: null,

        authentication: null,
        userId: null,

        params: {},
        items: {},

        approvalType: {},
        approvalInfos: {},

        "paging.page": 0,
        "paging.rows": 10,
    };


    var _config = {};

    supervision.hostAddr = "http://" + window.location.host;

    supervision.params = utils.getUrlParams();

    Ding.handle("23777027", window.location.href, function(config, user){
        Supervision.init(config.authenticationEncode);

        supervision.authentication = config.authenticationEncode;
    });



});