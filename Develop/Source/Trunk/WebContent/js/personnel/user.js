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
                        params.tempUserId = v.userId;
                        com.switchPage(api.index.userEditIndex.url);
                    });

                    $divBtnWrap.append($btnEdit).appendTo($h3);

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
        	console.log(data);
        	var dateObj = eval("("+data+")");
        }
    });
    
});
