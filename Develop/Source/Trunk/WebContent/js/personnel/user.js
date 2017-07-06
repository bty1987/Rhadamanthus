$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    /*	modals:$("#manage").on("show.bs.modal",function(a){
     com.clearValidator()
     });*/

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
                    var $addDD=$('<a></a>').addClass('btn btn-minier btn-danger').html('添加到钉钉');
                    var $updateDD=$('<a></a>').addClass('btn btn-minier btn-inverse').html('同步钉钉信息');
                    var $deleteDD=$('<a></a>').addClass('btn btn-minier btn-pink').html('从钉钉删除');
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
                        params.tempUserId = v.userId;
                        com.switchPage(api.index.userEditIndex.url);
                    });


                    //添加点击事件
                    $addDD.click(function(){
                        $("#tree3").removeData("tree");
                        $("#tree3").unbind('click');
                        $('#ddModal').modal('show');
                        var deptList = null;
                        com.post(api.dd.queryDDDepartment, {"department.id": 1}, function(res){
                            deptList = res.departments;
                        }, null, false);
                        if(!deptList.length) return;
                        var deptObj = {
                            '1' : {
                                name: '1',
                                type : 'folder',

                                id : 1
                            }
                        }, didList = [];
                        $.each(deptList, function(i, v){
                            didList.push(v.id);
                        });
                        $.each(deptList, function(i,v){
                            if(v.parentid && didList.indexOf(v.parentid) != -1){
                                didList.splice(didList.indexOf(v.parentid),1);
                            }
                        });

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
                                            $data = getDeptByDid(options.id);
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
                            'multiSelect' : true,
                            'selected-icon' : null,
                            'unselected-icon' : null,
                            folderSelect : true,
                            cacheItems : false

                        }).on('selected', function (evt, opt) {
                            //console.log(opt.info)
                        });
                        var getDeptByDid = function(did){
                            var depts = {};
                            $.each(deptList, function(i, v){
                                if(v.parentid == did){
                                    depts[v.id] = {
                                        name: v.name,
                                        type : didList.indexOf(v.id) == -1 ? 'folder' : 'item',
                                        id : v.id
                                    }
                                }
                            });
                            return depts;
                        };
                        function getSelectedDeptTree(id){
                            var flag = true;
                            var chain = '';
                            while(flag){
                                $.each(deptList, function(i, v){
                                    if(v.id == id){
                                        chain = chain ? v.name + '-' + chain : v.name + chain;
                                        if(v.parentid != 1){
                                            id = v.parentid
                                        }else{
                                            flag = false;
                                        }
                                        return false;
                                    }else return true;
                                });
                            }
                            return chain;

                        }

                        $('#save').unbind().bind('click',function(){
                            var items = $('#tree3' ).tree('selectedItems' );
                            var length = items.length;
                            var depts = [];
                            if(length){
                                for(var i =0; i<length; i++){
                                    depts.push(getSelectedDeptTree(items[i].id));
                                }
                            }
                            $('#ddModal').modal("hide");
                            var params = {"user.userid" : v.userId,
                                "user.Name":v.currentName,
                                "user.Mobile":v.phone,
                                "user.Position":v.duty,
                            };
                            if(length){
                                for(var i =0; i<length; i++){
                                    params["dids" + "[" + i + "]"]=items[i].id;
                                }
                            }

                            com.post(api.dd.queryDDUser, {"user.userid": v.userId}, function (res) {
                                if(res.user.userid != null){
                                    com.post(api.dd.updateDDUser, params, function(data){
                                        if($.trim(data.errcode) == $.trim(0) ){
                                            com.showAlert(com.info, "更新成功");
                                        }else{
                                            com.showAlert(com.error,"更新失败" );
                                        }
                                    });
                                } else{
                                    com.post(api.dd.addDDUser, params, function(data){
                                        if($.trim(data.errcode) == $.trim(0) ){
                                            com.showAlert(com.info, "创建成功");
                                        }else{
                                            com.showAlert(com.error,"创建失败" );
                                        }
                                    });

                                }
                            }, null, false);
                        });
                        $('#cancel').click(function(){
                            $("#tree3").removeData("tree");
                        });
                    });
                    $('#closeM').click(function(){
                        $("#tree3").removeData("tree");
                    });
//编辑钉钉信息
                    $updateDD.click(function(){
                      /*  params.tempUserId = v.userId;
                        com.switchPage(api.index.DDUserEditIndex.url);*/
                        var  selectedDepts=[];
                        com.post(api.dd.queryDDUser, {"user.userid": v.userId}, function(res){
                            selectedDepts = res.user.department;
                            if(selectedDepts == null){
                                com.showAlert(com.error,"该员工还没有添加到钉钉部门");
                                return;
                            }
                            var params = {
                            "user.userid" : v.userId,
                            "user.Name":v.currentName,
                            "user.Mobile":v.phone,
                            "user.Position":v.duty,
                             "dids":selectedDepts
                            }

                            com.post(api.dd.updateDDUser, params, function(data){
                                if($.trim(data.errcode) == $.trim(0) ){
                                    com.showAlert(com.info, "更新成功");
                                }else{
                                    com.showAlert(com.error,"更新失败" );
                                }
                            });

                          }, null, false);


                    });
//删除点击事件
                    $deleteDD.click(function(){
                        com.post(api.dd.queryDDUser, {"user.userid": v.userId}, function (res) {
                            if(res.user.name != null){
                                com.post(api.dd.deleteDDUser, {"userid":  v.userId}, function(data){
                                    if($.trim(data.errcode) == $.trim(0) ){
                                        com.showAlert(com.info, "删除成功");}
                                    else{com.showAlert(com.error,"删除失败");}
                                });
                            }
                            else{
                                com.showAlert(com.error, "钉钉中没有该用户，无法删除");
                            }
                        });
                    });

                    $divBtnWrap.append($btnEdit).append($addDD).append($updateDD).append($deleteDD).appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);
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
    var _condArr = ['userId', 'userName', 'roleId', 'deptType', 'deptId', 'userstatus', 'identity'];

    var userSeacher = new Searcher();

    userSeacher.init( _condArr, "condList", api.personel.pageUser, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "userPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addUser').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $importa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $importi = $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
        var $importspan = $('<span></span>').text('上传').appendTo($importa);

        return [$adda, $importa];
    });

    $('a[name="addUser"]','#pagenation').click(function(){
        params.tempUserId = null;
        com.switchPage(api.index.userEditIndex.url);
    });

    $('a[name="import"]','#pagenation').click(function(){
        $('#importModal').modal("show");
    });

    $('#import').Huploadify({
        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout':config.uploadTimeout, // 超时时间
        'formData':{
            'uploadType':4,
        },
        'buttonClass': 'btn btn-success col-sm-12',
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.server + 'importUserSalary.do', // 上传处理程序
        'height':'30', // 浏览按钮的高度
        'fileTypeDesc':'支持的格式：',  // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.xls;*.xlsx', // 允许上传的文件后缀
        'fileSizeLimit':'5MB', // 上传文件的大小限制
        'queueSizeLimit' : 1, // 上传数量
        'onUploadSuccess':function(file, data, response){ //上传到服务器，服务器返回相应信息到data里

            var dateObj = eval("("+data+")");
        }
    });

});

