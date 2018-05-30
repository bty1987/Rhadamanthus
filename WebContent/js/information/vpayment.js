
jQuery(function($) {

    var way={};
    var type={};
    var vpayment = {
        saveBtn: null,
        modal: null,
        items: {
            mno : $('#mno'),
            collecter : $('#collecter'),
            type : $('#type'),
            way : $('#way'),
            brand : $('#brand'),
            money : $('#money'),
            receipt : $('#receipt')
        }
    };

    vpayment.saveBtn = $("#saveBtn").on("click", saveData);

    vpayment.modal = $("#vpaymentModal");
    vpayment.modal.on('show.bs.modal',function(e){
        com.clearValidator("#vpayment.item", true);
    });

    com.initChosen('collecter', api.personel.queryUserByDepartmentType, "pinyinName", {"departmentType.name":"", "user.status":0}, "autoFillKeyValue", "key", "value");

    com.post(api.ds.information,{},function(res){
        $("#type").bindData(res.vpayment,"key","value");
        $.each(res.vpayment,function(i,v){
            type[v.key]=v.value;
        })
    },null,false);

    com.post(api.ds.information,{},function(res){
        $("#way").bindData(res.ways,"key","value");
        $.each(res.ways,function(i,v){
            way[v.key]=v.value;
        })
    },null,false);

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.mno));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnAdd = $('<a></a>').addClass('btn btn-minier btn-yellow').html('删除');

            var brand="";
            if(v.type == 1){
                brand= v.brand
            }else if(v.type == 3){
                brand= v.brand
            }else if(v.type == 0 || v.type == 2 || v.brand == null || v.brand == ""){
                brand="---"
            }
            var propertyArr = [
                ["创建人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "blue"],
                ["收款人:", v.collecter.currentName, "grey"],
                ["收款时间:", v.collectTime, "blue"],
                ["类型:",  type[v.type] , "grey"],
                ["收款方式:", way[v.way], "grey"],
                ["收据号:", v.receipt == null ? "---" : v.receipt, "grey"],
                ["品牌:", brand , "grey"],
                ["金额:", v.money, "blue"],
                ["备注:", v.comment , "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnAdd).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnAdd.click(function(){
                    delect(v.vpid)
            });


            return $liLine;



        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();

    searcher.init(["vp_mno","vp_brand"], "condList", api.information.pageVpayment, function(data){
        displayFunc.init('resultList', data);

    }, "pagenation", "vpaymentPostData",null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'createVpayment').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    //删除
    function delect(id){
        var btn=$(this);
        var span=btn.find('span');
        btn.find('i').remove();
        var  loading=$('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
        span.prepend(loading);
        var totle="<p>确定删除活动款么?</p>";
        bootbox.confirm(totle , function(result){
            if(result){
                var option={
                    "vpayment.vpid":id
                };
                com.post(api.information.deleteVpaymentId,option,function(res){
                    searcher.doSearch();
                    com.showAlert(com.info,'删除成功');
                });
            }else{
                btn.find('i').remove();
                var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                span.prepend(prepared);
            }
        })
    }

    //添加
    $('a[name="createVpayment"]', '#pagenation').click(function(){
        com.updateChosen("collecter", "", "");
        com.cleanItems(vpayment.items);
        $("#vpaymentModal").modal("show");
        var $_modalBody = $('.modal-body');
        var _brand=$_modalBody.find('input[name="brand"]');
        _brand.attr('readonly',"readonly");
        _brand.removeClass('v_required');
        $('#type').on('change', function(){
            var way = $_modalBody.find('select[name="type"] option:selected').val();
            var $brand = $_modalBody.find('input[name="brand"]');
            if(way == 0){
                $brand.attr('readonly',"readonly");
                $brand.addClass('v_required');
            }else if(way == 1){
                $brand.attr('readonly',"readonly");
                $brand.removeClass('v_required');
            }else if(way == 2){
                $brand.removeAttr('readonly');
                $brand.addClass('v_required');
            }else if(way == 3){
                $brand.removeAttr('readonly');
                $brand.removeClass('v_required');
             }
        });
    });

    function saveData(){
        if(com.validate('vpaymentModal')){
            return;
        }
        var $_modalBody = $('.modal-body');
        var mno= $("#mno").val();
        var collecter = $_modalBody.find('select[name="collecter"] option:selected').val();//
        var type = $_modalBody.find('select[name="type"] option:selected').val();
        var way = $_modalBody.find('select[name="way"] option:selected').val();
        var brand = $_modalBody.find('input[name="brand"]').val();
        var receipt=$("#receipt").val();
        var money = $("#money").val();
        var comment=$("#comment").val();
        var options = {
            'vpayment.mno': mno,
            'vpayment.collecter.userId': collecter,
            'vpayment.type': type,
            'vpayment.way': way,
            'vpayment.brand':brand,
            'vpayment.receipt':receipt,
            'vpayment.money': money,
            'vpayment.comment': comment
        };
        com.post(api.information.createVpayment, options, function(res){
            searcher.doSearch();
            com.cleanItems(vpayment.items);
            com.clearValidator("#no", true);
            com.clearValidator("#collecter", true);
            com.clearValidator("#type", true);
            com.clearValidator("#way", true);
            com.clearValidator("#brand", true);
            com.clearValidator("#money", true);
            com.clearValidator("#comment", true);
            com.clearValidator();

            com.showAlert(com.info, "操作成功");
        });

        vpayment.modal.modal("hide");
    }

    $('input[name="collecter"]').typeahead({
        url: api.personel.queryUserForNameByPinyinName,//获取下拉列表的接口
        list: [],
        postData: {},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName: query,"user.status":""}, this.options.postData);
            com.post(this.options.url, options, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            this.options.list = data["autoFillKeyValue"];
            this.flprocess(this.options.list, ["key"], ["value"]);
        },
        isResultTypeMap: true, //必填值为true，获取key，value的标识，
         flupdater: function (k, v) {//下拉列表选中时的一些处理，必填对选中项的key和value做处理
            $('input[name="collecter"]').attr('data-coid',k);
            return v;
        }
    });

    com.post(api.ds.information, {}, function(res){
        $('#type').bindData(res.vpayment, 'key','value');
    });
    com.post(api.ds.information, {}, function(res){
        $('#way').bindData(res.ways, 'key','value');
    });

    $('input[name="brand"]').typeahead({
        url: api.data.queryBrandForPinYinName,//获取下拉列表的接口
        list: [],
        postData: {},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName : query}, this.options.postData);
            com.post(this.options.url, options, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            this.options.list = data["brands"];
            this.flprocess(this.options.list, ["bid"], ["brandName"]);
        },
        isResultTypeMap: true //必填值为true，获取key，value的标识，
        , flupdater: function (k, v) {//下拉列表选中时的一些处理，必填对选中项的key和value做处理
            $('input[name="brand"]').attr('data-brand',v);
            return v;
        }
    });

});
