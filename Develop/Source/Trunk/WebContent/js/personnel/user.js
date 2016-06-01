$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){

                $.each(listData,function(i, v){
                    var $liLine = $('<li></li>').addClass('item-blue clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.userName));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('编辑');

                    var propertyArr = [
                        ["员工编号:", v.userId, "grey"],
                        ["用户名:", v.loginId, "grey"],
                        ["部门:", v.dept.deptName, "grey"],
                        ["职位:", v.duty, "grey"],
                        ["角色:", v.role.roleName, "grey"],
                        ["联系方式:", v.phone, "grey"]
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $btnEdit.click(function(){
                        viewUser(v.userId+"");
                    });

                    $divBtnWrap.append($btnEdit).appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };
        //查看
        var viewUser = function (userId){
            params.tempUserId = userId;
            $("#fl-container").load("/views/personnel/userEdit.html");
        };
        //添加
        var addUser = function(){
            params.tempUserId = null;
            $("#fl-container").load("/views/personnel/userEdit.html");
        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            }, initAddUser: function(){
            	$('a[name="addUser"]','#pagenation').click(function(){
                    addUser();
                });
            }
        }
    })();

    var _condArr = ['userId', 'userName', 'roleId', 'deptType', 'deptId', 'userstatus', 'identity'];

    var userSeacher = new Searcher();
    
    userSeacher.init( _condArr, "condList", api.personel.pageUser, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "userPostData");

    displayFunc.initAddUser();
});
