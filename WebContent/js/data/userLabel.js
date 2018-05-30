var label={

};
$(function(){

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
        var $tableWrap = $('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        if(listData && listData.length){

            $.each(listData,function(i, v){
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.userName));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
                var $label = $('<a></a>').addClass('btn btn-minier btn-success').html('标签');

                var propertyArr = [
                    ["员工编号:", v.userId, "grey"],
                    ["用户名:", v.loginId, "grey"],
                    ["部门:", v.dept.deptName, "grey"],
                    ["职位:", v.duty.name, "grey"],
                    ["角色:", v.role.name, "grey"],
                    ["联系方式:", v.phone, "grey"]
                ];

                $.each(propertyArr, function (index,value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $divBtnWrap.append($btnEdit).append($label).appendTo($h3);

                $liLine.append($h3).append($ulProperty).appendTo($ul);

                $btnEdit.click(function(){

                    label.tempUserId=v.userId;
                    label.uid = v.uid;

                    com.switchPage(api.index.checkUser.url);

                })

                $label.click(function(){
                    labelling(v.uid);
                })

            });
            $ul.appendTo($tableWrap);
        }
        };
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            }
        }
})();

    var _condArr = ['userId', 'userName','deptType'];

    var userSeacher = new Searcher();

    userSeacher.init( _condArr, "condList", api.personel.pageUser, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "selectUser", null, false, null, function(){});

    function labelling(uid){
        var $label=$('#label');
        $label.attr({'data-uid':uid});
            var index = layer.open({
                type: 1,
                title:'标签管理',
                content: $label,
                area: [( $(window).width() * 0.7 < 1000 ? $(window).width() * 0.7 : 1000 ) + "px", ( $(window).height() * 0.84 < 620 ? $(window).height() * 0.84 : 620 ) + "px"],
                maxmin: false,
                zIndex: 9000,
                btn: ['取消'],
                success: function(index, layero){
                    label.id = uid;
                    $label.load("views/data/checkLabel.html")
                },
                end:function(){
                    $label.attr('data-uid',null)
                }
            });
    }

});