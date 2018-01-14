/**
 * Created by Administrator on 2016/12/4.
 */

$(function(){

    var deptList = null;
    com.post(api.department.queryDepartment, {}, function(res){
        deptList = res.deptList;
    }, null, false);

    if(!deptList.length) return;

    var deptObj = {}, didList = [];

    //获取所有叶子节点
    $.each(deptList, function(i, v){
        didList.push(v.did);
    });
    $.each(deptList, function(i,v){
        if(v.fatherDept && didList.indexOf(v.fatherDept.did) != -1){
            didList.splice(didList.indexOf(v.fatherDept.did),1);
        }
    });
    //获取根节点
    $.each(deptList, function(i, v){

        if(v.fatherDept !=null &&v.fatherDept.did !=null &&v.fatherDept.did !=0){
                return true;
            }

        if(!deptObj[v.company]){
            deptObj[v.company] = {
                name:params.company.name,
                type : 'folder',
                children : {}
            }
        }

        deptObj[v.company]['children'][v.did] = {
            name: v.deptName,
            type : didList.indexOf(v.did) == -1 ? 'folder' : 'item',
            did : v.did,
            deptid : v.deptId
        };

    });

    var getDeptByDid = function(did){
        var depts = {};

        $.each(deptList, function(i, v){
            if(!v.fatherDept) return true;


            if(v.fatherDept.did == did){
                depts[v.did] = {
                    name: v.deptName,
                    type : didList.indexOf(v.did) == -1 ? 'folder' : 'item',
                    did : v.did,
                    deptid : v.deptId
                }
            }
        });

        return depts;
    };

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){

                $.each(listData,function(i, v){
                    var $liLine = $('<li></li>').addClass('item-blue clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.userName));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var propertyArr = [
                        ["员工编号:", v.userId, "grey"],
                        ["用户名:", v.loginId, "grey"],
                        ["部门:", v.dept.deptName, "grey"],
                        ["职位:", v.duty.name, "grey"],
                        ["角色:", v.role.roleName, "grey"],
                        ["联系方式:", v.phone, "grey"]
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });


                    $liLine.append($h3).append($ulProperty).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };
        //查看
        var viewUser = function (userId){
            params.tempUserId = userId;
            com.switchPage("/views/personnel/userEdit.html");
        };
        //添加
        var addUser = function(){
            params.tempUserId = null;
            com.switchPage("/views/personnel/userEdit.html");
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

    var _condArr = [];
    var userSeacher = new Searcher();

    $('#tree3').ace_tree({
        dataSource: {
            data : function(options, callback) {

                var $data = null;

                if(!("name" in options) && !("type" in options)){
                    $data = deptObj;//the root tree
                    callback({ data: $data });
                    return;
                }
                else if("type" in options && options.type == "folder") {
                    if("children" in options)
                        $data = options.children;
                    else {
                        $data = getDeptByDid(options.did);
                    }
                }

                if($data != null)
                    setTimeout(function(){callback({ data: $data });} , parseInt(Math.random() * 500) + 200);
            }
        },
        loadingHTML:'<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
        'open-icon' : 'icon-minus',
        'close-icon' : 'icon-plus',
        'selectable' : true,
        'selected-icon' : null,
        'unselected-icon' : null,

    }).on('selected', function (evt, opt) {
        userSeacher.init( _condArr, "condList", api.personel.pageUser, function(data){
            displayFunc.init('resultList', data);
        }, "pagenation", "menuPostData", {
            'filters[0].data' : opt.info[0].deptid,
            'filters[0].field' : 'deptId',
            'filters[0].op' : 'eq'
        });
    });
});