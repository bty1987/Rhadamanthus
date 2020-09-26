
$(function(){
    
    var muser = {
        items:{
            name: com.focusPage("#name"),
            phone: com.focusPage("#phone"),
            unionvid: com.focusPage("#unionvid"),
            gender: com.focusPage("#gender"),
            birthday: com.focusPage("#birthday"),
        },
        
        btns: {
            saveBtn: com.focusPage("#saveBtn")
        }
    };
    
    com.datetime(com.focusPage(".date-picker"), "date");
    
    muser.btns.saveBtn.click(updateData);

    var displayFunc  = (function(){
        /*表格样式*/
        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);

            if(listData && listData.length){
                
                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData,function(i, v){
                    creatLine(i, v, i == listData.length - 1).appendTo($ulTitle);
                });
            }
        };

        /*表格头*/
        var createTableTitle = function(){
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col5');
            var titleName ='姓名,电话,性别,生日';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };
        /*表格体*/
        var creatLine = function (i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var id = i + 1;
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(id));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col5');

            var propertyArr = [
                [v.name,'grey'],
                [v.phone == null ? "无": v.phone ,'grey'],
                [v.gender =="0" ? "男" : "女",'red'],
                [v.birthday == null ? "无" : v.birthday ,'red']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            var $update = $('<li></li>').append($('<a></a>').html('编辑'));
            var $address = $('<li></li>').append($('<a></a>').html('地址'));

            $btnUl.append($address).append($update);
            $btnUl.append($address).append($update);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            //地址点击事件
            $address.click(function () {
                
                params.muser = v;
                
                com.popup4page("#userAddressPopUp", 'views/store/address.html', "地址", function(){
                    searcher.doSearch();
                });
            });

            //编辑
            $update.click(function(){
                
                com.cleanItems(muser.items);
                
                initUpdate(v);
                
                com.popup4model('#layerAdd', '编辑', null, function () {
                    com.clearValidator();
                    searcher.doSearch();
                });
            });
            
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
        };
    })();

    var searcher = new Searcher();

    searcher.init( ["store-muser-name"], "condList", api.store.pageMuser, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "muserPostData", null, false, null, null,'resultList');

    function initUpdate(v){
        
        muser.unionId = v.unionId;
        
        muser.items.name.val(v.name);
        muser.items.phone.val(v.phone);
        muser.items.gender.val(v.gender);
        muser.items.birthday.val(v.birthday);
    }

    function updateData(){
        
        if(com.validate('form1')) return false;
        
        var url = api.store.updateMuser;
        var options = {
            "muser.unionId": muser.unionId,
            "muser.phone": muser.items.phone.val(),
            "muser.name": muser.items.name.val(),
            "muser.gender": muser.items.gender.val(),
            "muser.birthday": muser.items.birthday.val()
        }
        
        com.post(url, options, function(res){
            com.closePopup();
            searcher.doSearch();
        });
    }
});

