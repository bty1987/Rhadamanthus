
jQuery(function($) {
    var ecity = {
        saveBtn: null,
        modal: null,
        items: [],
        validator: null
    };

    ecity.saveBtn = com.focusPage("#saveBtn").on("click", saveData);

    ecity.items.city = com.focusPage("#city");
    ecity.items.x = com.focusPage("#x");
    ecity.items.y = com.focusPage("#y");

    ecity.modal = com.focusPage("#ecityModal");
    ecity.modal.on('show.bs.modal',function(e){
        com.clearValidator();
    });

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
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

            var that = this;
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.city));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [
                ["名称:", v.city, "grey"],
                ["经度:", v.y, "grey"],
                ["纬度:", v.x, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();
    var conditionList = ["market-city"];

    searcher.init(conditionList, "condList", api.market.pageEcity, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "ecityPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addEcity').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    //添加
    com.focusPage('a[name="addEcity"]', '#pagenation').click(function(){
        com.cleanItems(ecity.items);
        com.clearValidator("ecityModal");
        com.focusPage("#ecityModal").modal("show");
    });

    function saveData(){
        if(com.validate() ){
            return;
        }

        var options = {
            "ecity.city": ecity.items.city.val(),
            "ecity.x": ecity.items.x.val(),
            "ecity.y": ecity.items.y.val()
        };

        com.post(api.market.addEcity, options, function(res){
            com.showAlert(com.info, "创建成功");
            searcher.doSearch();
        });

        com.focusPage("#ecityModal").modal("hide");
    }

});
