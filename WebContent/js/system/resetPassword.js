
jQuery(function($) {

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

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.userName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnReset = $('<a></a>').addClass('btn btn-minier btn-yellow').html('重置密码');

            var propertyArr = [
                ["编号:", v.userId, "grey"],
                ["用户名:", v.loginId, "grey"],
                ["部门:", v.dept.name, "grey"],
                ["职位:", v.duty.name, "grey"],
                ["角色:", v.role.name, "grey"],
                ["电话:", v.phone, "grey"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnReset).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnReset.click(function(){
                resetPassword(v.userId, v.userName);
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
        }
    })();

    var searcher = new Searcher();

    searcher.init(["userId", "userName"], "condList", api.personel.pageUser, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "resetPwdPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addAction').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
        
    });

    function resetPassword(userId, userName){
        bootbox.confirm("确定要重置("+userName+")的密码吗?",function(result){
            if(result == true){
                com.post(api.personel.resetPassword, {'user.userId': userId},function(res){

                });
            }
        });
    }

});

