
$(function(){
    var notice = {
        //定义SaveBtn获得noticeMng.html页的#saveBtn点击事件
        saveBtn: $("#saveBtn").on("click", saveData),
        //定义cancelBtn获得noticeMng.html页的#cancelBtn取消按钮
        cancelBtn: $("#cancelBtn"),
      /*  modals:$("#managements").on("show.bs.modal",function(){
            modal("show");
        }),*/
        //弹出模态框
        modal: $("#noticeModal").on("show.bs.modal", function(a) {
            com.clearValidator()
        }),
        //获取noticeMng.html的ID属性
        items: {
            theme : $("#theme"),
            typeSel : $("#typeSel"),
            prioritySel : $("#prioritySel"),
            startTime : $("#startTime"),
            endTime : $("#endTime"),
            isPublic : $("#isPublic").switchBtn("isOrNot"),
            contents : $("#contents"),
        },
        editFlg: !1,
        postParam: {},
        repeatFlg: !1
    };

    bindUploadfiy();
//Datepicker是绑在一个标准的形式输入字段
    $(".date-picker").datepicker({autoclose : !0}).on("show", function() {
        setTimeout(function() {
            $(".dropdown-menu").css("z-index", 1060);
        },0);
    }).next().on(ace.click_event, function() {
        $(this).prev().focus();
    });

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId).empty();
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
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.theme));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');


            var $btnDown = $('<a></a>').addClass('btn btn-minier btn-success').html('下载');
            var $management = $('<a></a>').addClass('btn btn-minier btn-primary').html('管理');


            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [
                ["类型:", v.type, "grey"],
                ["优先级:", v.priority, "green"],
                ["发布部门:", v.dept.deptName, "grey"],
                ["发布人:", v.user.currentName, "grey"],
                ["开始时间:", v.startTime, "grey"],
                ["结束时间:", v.endTime, "grey"],
                ["公开:", v.isPublic, "blue"],
                ["内容:", v.contentsText, "grey"],

            ];
            //循环出li中的属性
            $.each(propertyArr, function (index,value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);

            });
            //undefined是判断是不是未定义的，如果v.filePath没有未定义 并且v.filePath 不等于空
            if(v.filePath != undefined && v.filePath != null && v.filePath != ""){
                //插入btnDown
            	$divBtnWrap.append($btnDown);
        	}


            if(v.isPublic=="否") {
                $divBtnWrap.append($management).append($btnEdit).append($btnDel).appendTo($h3);
                $liLine.append($h3).append($ulProperty);
            }else{
                $divBtnWrap.append($btnEdit).append($btnDel).appendTo($h3);
                $liLine.append($h3).append($ulProperty);
            }

            $btnDown.click(function(){
            	window.open(config.media + v.filePath);
            	return false;
            });

            $btnEdit.click(function(){
                notice.editFlg = !0;
                var a = v;
                void 0 != a && (notice.items.noticeId = a.noticeId, notice.items.userId = a.user.userId, notice.items.theme.val(a.theme), notice.items.typeSel.val(a.type), notice.items.prioritySel.val(a.priority), notice.items.deptSel = a.dept.deptId, notice.items.startTime.val(a.startTime), notice.items.endTime.val(a.endTime), notice.items.isPublic.prop("checked", com.isOrNotType[a.isPublic]), notice.items.contents.html(a.contents), notice.modal.modal("show"))
            });

            $management.unbind().bind('click',function(){
                $("#tree3").removeData("tree");
                $("#tree3").unbind('click');


                var deptList =null;
                com.post(api.department.queryDepartment, {"dept.type": "all"}, function(res){
                    deptList = res.deptList;

                    console.log(deptList);
                }, null, false);

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
                var types=[];


                //获取根节点
                $.each(deptList, function (i, v) {


                    console.log("wwwwwwwwwwwwwwwwww");
                    if (v.fatherDept) return true;

                    if (!deptObj[v.type]) {
                        deptObj[v.type] = {
                            name: v.type,
                            type: 'folder',
                            children: {}

                        }
                    }

                    //   console.log(v.company);

                    deptObj[v.type]['children'][v.did] = {

                        name: v.deptName,
                        type: didList.indexOf(v.did) == -1 ? 'folder' : 'item',
                        did: v.did,
                        deptid: v.deptId

                    };
                    //    console.log(v.deptId);


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
                            // console.log("did"+did);
                        }

                    });

                    return depts;

                };


                $('#tree3').ace_tree({
                    dataSource: {
                        data : function(options, callback) {
                            var checkbox=$('<input type="checkbox" />');
                            var treeclass=$("#treecheck");
                            var $data = null;


                            if(!("name" in options) && !("type" in options)){
                                $data = deptObj;//the root tree
                                // console.log($data);
                                callback({ data: $data });
                                return;
                            }
                            else if("type" in options && options.type == "folder") {

                                if("children" in options)
                                    $data = options.children;
                                else {
                                    $data = getDeptByDid(options.did);

                                }
                                //  console.log($data);

                            }

                            treeclass.appendTo(checkbox);
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
                    'multiSelect': true,
                    treeItemSelect:true,
                    cacheItems: false,


                });
                $('#managements').modal('show');

                $("#manageBtn").unbind().bind('click',function(){



                    var items=$('#tree3').tree('selectedItems');

                    $("#tree3").removeData("tree");
                    $("#tree3").unbind('click');
                    var dids={

                    }
                    var option={

                        "notice.noticeId": v.noticeId
                    };

                    // console.log(v.noticeId);
                    //循环将选中的部门did放到option里
                    $.each(items,function(i,value){

                        dids["dids["+i+"]"]= value.did;

                    })
                    if($.isEmptyObject(dids)){
                        com.showAlert(com.error,"部门不能为空");
                        return false;
                    }
                        com.post(api.information.updateNoticeDepartments, $.extend(option,dids));

                });

            });

            $btnDel.click(function(){
                bootbox.confirm("确定删除吗？", function(result) {
                    if(result) {
                        removeRow(v.noticeId);
                    }
                });
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

    var _condArr = ['theme', 'dateRange', 'deptId'];
    var NoticeMngSeacher = new Searcher();
    //将条件返回condList里
    NoticeMngSeacher.init( _condArr, "condList", api.information.pageNotice, function(list){
        //将结果返回到页面的div里的id
        displayFunc.init('resultList', list);
    }, "pagenation", "noticeMngSeacherPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addVillage').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            notice.editFlg = !1;
            com.cleanItems(notice.items);
            notice.items.contents.html("");
            notice.modal.modal("show")
        });


        return [$adda];
    });

    function saveData() {
        if (!com.validate() && !notice.repeatFlg) if ("" == notice.items.contents.text().trim()) com.showTips(notice.items.contents, "内容不能为空.");
        else {
            var a, b = {
                "notice.theme": notice.items.theme.val(),
                "notice.type": notice.items.typeSel.val(),
                "notice.priority": notice.items.prioritySel.val(),
                "notice.user.userId": notice.items.userId,
                "notice.startTime": notice.items.startTime.val(),
                "notice.endTime": notice.items.endTime.val(),
                "notice.isPublic": com.isOrNotType[notice.items.isPublic.prop("checked")],
                "notice.contents": notice.items.contents.html(),
                "notice.contentsText": notice.items.contents.text(),
                "notice.filePath": $("#filePath").val()
            };
            notice.editFlg ? (a = api.information.updateNotice, b["notice.noticeId"] = notice.items.noticeId, b["notice.dept.deptId"] = notice.items.deptSel) : a = api.information.addNotice;
            com.post(a, b, successCallback);
            notice.modal.modal("hide")
        }
    }

    function removeRow(id) {
        com.post(api.information.deleteNotice, {"noticeIds[0]" : id}, successCallback);
    }

    function successCallback() {
        com.showAlert(com.info, "操作成功");
        NoticeMngSeacher.doSearch();
    }
    
    function bindUploadfiy() {
        $("#attachment").Huploadify({
            auto: !0,
            successTimeout: 99999,
            formData: {
                username: "用户名",
                rnd: "加密密文",
                uploadType: 3
            },
            buttonText: "上传附件",
            buttonClass: "btn btn-sm btn-primary lineheight0",
            overrideEvents: ["onDialogClose"],
            fileObjName: "strutsUploads",
            uploader: config.media + api.common.uploadOther.url,
            width: "78",
            onSelectError: function(a, b, c) {
                switch (b) {
                    case -100:
                        alert("上传的文件数量已经超出系统限制的" + $("#file_upload").uploadify("settings", "queueSizeLimit") + "个文件!");
                        break;
                    case -110:
                        alert("文件 [" + a.name + "] 大小超出系统限制的" + $("#file_upload").uploadify("settings", "fileSizeLimit") + "大小!");
                        break;
                    case -120:
                        alert("文件 [" + a.name + "] 大小异常！");
                        break;
                    case -130:
                        alert("文件 [" + a.name + "] 类型不正确！")
                }
            },
            onUploadSuccess: function(a, b, c) {
                a = eval("(" + b + ")");
                0 == a.errorCode ? $("#filePath").val(a.resUrl) : alert(b)
            },
            itemTemplate: '<div id="${fileID}" class="uploadify-queue-item" style="position:absolute;top:-30px;width:200px;left:-200px;">\r\n\t\t\t<div class="cancel">\r\n\t\t\t\t<a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">X</a>\r\n\t\t\t</div>\r\n\t\t\t<span class="fileName">${fileName} (${fileSize})</span><span class="data"></span>\r\n\t\t\t<div class="uploadify-progress">\r\n\t\t\t\t<div class="uploadify-progress-bar"><!--Progress Bar--></div>\r\n\t\t\t</div>\r\n\t\t</div>'
        })
    };

    initializeContent();
    function initializeContent(){

        $("#contents").ace_wysiwyg({
            toolbar: ["font", null, "fontSize", null,
                {
                    name: "bold",
                    className: "btn-info"
                }, {
                    name: "italic",
                    className: "btn-info"
                }, {
                    name: "strikethrough",
                    className: "btn-info"
                }, {
                    name: "underline",
                    className: "btn-info"
                },
                null,
                {
                    name: "insertunorderedlist",
                    className: "btn-success"
                }, {
                    name: "insertorderedlist",
                    className: "btn-success"
                }, {
                    name: "outdent",
                    className: "btn-purple"
                }, {
                    name: "indent",
                    className: "btn-purple"
                },
                null,
                {
                    name: "justifyleft",
                    className: "btn-primary"
                }, {
                    name: "justifycenter",
                    className: "btn-primary"
                }, {
                    name: "justifyright",
                    className: "btn-primary"
                }, {
                    name: "justifyfull",
                    className: "btn-inverse"
                },
                null, null, null, null, null, null, "foreColor", null,
                {
                    name: "undo",
                    className: "btn-grey"
                }, {
                    name: "redo",
                    className: "btn-grey"
                }],
            wysiwyg: {
                fileUploadError: showErrorAlert
            }
        }).prev().addClass("wysiwyg-style2");
        if ("undefined" !== typeof jQuery.ui && /applewebkit/.test(navigator.userAgent.toLowerCase())) {
            var a = function() {
                    null != b && (b.resizable("destroy"), b.removeData("resizable"), b = null)
                },
                b = null;
            (function() {
                $(".wysiwyg-editor").on("mousedown", function(a) {
                    var d = $(a.target);
                    a.target instanceof HTMLImageElement && !d.data("resizable") && (d.resizable({
                        aspectRatio: a.target.width / a.target.height
                    }), d.data("resizable", !0), null != b && (b.resizable("destroy"), b.removeData("resizable")), b = d)
                }).on("click", function(c) {
                    null == b || c.target instanceof HTMLImageElement || a()
                }).on("keydown", function() {
                    a()
                })
            })()
        }
    }

    function showErrorAlert(a, b) {
        var c = "";
        "unsupported-file-type" === a ? c = "Unsupported format " + b : console.log("error uploading file", a, b);
        $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button><strong>File upload error</strong> ' + c + " </div>").prependTo("#alerts")
    }

/*

    showTree()
    function showTree() {

        var deptList =null;
    com.post(api.department.queryDepartment, {"dept.type": "all"}, function(res){
        deptList = res.deptList;

        console.log(deptList);
    }, null, false);

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
    var types=[];


    //获取根节点
    $.each(deptList, function (i, v) {


        console.log("wwwwwwwwwwwwwwwwww");
        if (v.fatherDept) return true;

        if (!deptObj[v.type]) {
               deptObj[v.type] = {
                name: v.type,
                type: 'folder',
                children: {}

            }
        }

        //   console.log(v.company);

        deptObj[v.type]['children'][v.did] = {

            name: v.deptName,
            type: didList.indexOf(v.did) == -1 ? 'folder' : 'item',
            did: v.did,
            deptid: v.deptId

        };
        //    console.log(v.deptId);


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
                // console.log("did"+did);
            }

        });

        return depts;

    };


    $('#tree3').ace_tree({
        dataSource: {
            data : function(options, callback) {
                var checkbox=$('<input type="checkbox" />');
                var treeclass=$("#treecheck");
                var $data = null;


                if(!("name" in options) && !("type" in options)){
                    $data = deptObj;//the root tree
                    // console.log($data);
                    callback({ data: $data });
                    return;
                }
                else if("type" in options && options.type == "folder") {

                    if("children" in options)
                        $data = options.children;
                    else {
                        $data = getDeptByDid(options.did);

                    }
                    //  console.log($data);

                }

                treeclass.appendTo(checkbox);
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
        'multiSelect': true,
        treeItemSelect:true,
        cacheItems: false,


    });

}
*/



});
