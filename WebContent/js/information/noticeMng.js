$(function(){

    var notice = {
        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),

        modals: {
            noticeModal: com.focusPage("#noticeModal"),
            managementsModal: com.focusPage('#managements')
        },
        items: {
            theme : com.focusPage("#theme"),
            typeSel : com.focusPage("#typeSel"),
            prioritySel : com.focusPage("#prioritySel"),
            startTime : com.focusPage("#startTime"),
            endTime : com.focusPage("#endTime"),
            isPublic : com.focusPage("#isPublic"),
            contents : com.focusPage("#contents"),
            filePath : com.focusPage("#filePath"),
            fileName : com.focusPage("#fileName")
        },

        noticeType: {},
        noticePriority: {},
        noticeIsPublic: {},

        editFlg: false,
        postParam: {},
    };

    notice.saveBtn.bindClick(saveData);
    notice.items.isPublic.switchBtn("isOrNot");

    notice.modals.noticeModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(notice.items);
    });
    com.post(api.ds.information, {}, function(res){
        notice.items.prioritySel.bindData(res.noticePriority, "key", "value");
        notice.items.typeSel.bindData(res.noticeType, "key", "value");

        notice.noticeType = res.noticeType.split("key", "value");
        notice.noticePriority = res.noticePriority.split("key", "value");
        notice.noticeIsPublic = res.noticeIsPublic.split("key", "value");

    },null,false);

    bindUploadfiy();

    com.datetime(com.focusPage(".date-picker-date"));

    var displayFunc  = (function(){
        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId).empty();
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
            var $ulDept = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDown = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
            var $management = $('<a></a>').addClass('btn btn-minier btn-success').html('管理');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-warning').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var myDate= new Date();
            var starts = new Date(v.startTime);
            var end = new Date(v.endTime);

            var propertyArr = [
                ["类型:", notice.noticeType[v.type], "grey"],
                ["优先级:", notice.noticePriority[v.priority], "green"],
                ["发布人:", v.creater.currentName, "grey"],
                ["开始时间:", v.startTime, "grey"],
                ["结束时间:", v.endTime, "grey"],
                ["公开:", notice.noticeIsPublic[v.isPublic], "blue"],
                ["内容:", v.contents, "grey"],
                ["状态:", starts <= myDate && end >= myDate ? "有效":"无效", "blue"],
                ["文件名:", v.fileName == "" || v.fileName == null ? "无" : v.fileName, "red"]
            ];

            //循环出li中的属性
            $.each(propertyArr, function (index,value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                $liProperty.appendTo($ulProperty);

            });

            if(v.filePath != undefined && v.filePath != null && v.filePath != ""){
                //插入btnDown
                $divBtnWrap.append($btnDown);
        	}

            if(v.creater.uid == params.userInfo.user.uid){

                if(v.isPublic == 1) {
                    $divBtnWrap.append($management).appendTo($h3);

                    var $liDepts = $('<li></li>');
                    $('<strong></strong>').html('部门范围:').appendTo($liDepts);
                    $('<b></b>').html(v.depts == null ? "无" : v.depts).addClass("red").appendTo($liDepts);

                    $liDepts.appendTo($ulDept);
                }

                $divBtnWrap.append($btnEdit).append($btnDel).appendTo($h3);
                $liLine.append($h3).append($ulProperty).append($ulDept);
            }

            if(starts <= myDate && end >=myDate){
                if(v.isPublic == 1) {
                    $liLine.append($h3).append($ulProperty).append($ulDept);
                }else{
                    $liLine.append($h3).append($ulProperty).append($ulDept);
                }
            }else{
                $liLine.append($h3).append($ulProperty).append($ulDept);
            }
            $btnDown.click(function(){
                var url = config.media + v.filePath;

                com.popup('公告', url);

            	return false;
            });

            $btnEdit.click(function(){
                notice.editFlg = true;

                notice.items.nid = v.nid;
                notice.items.noticeId = v.noticeId;
                notice.items.userId = v.creater.userId;
                notice.items.theme.val(v.theme);
                notice.items.typeSel.val(v.type);
                notice.items.prioritySel.val(v.priority);
                notice.items.startTime.val(v.startTime);
                notice.items.endTime.val(v.endTime);
                notice.items.isPublic.prop("checked", v.isPublic == 0);
                notice.items.contents.val(v.contents);
                notice.items.filePath.val(v.filePath);
                notice.items.fileName.val(v.fileName);

                notice.modals.noticeModal.modal("show");
            });

            $management.unbind().bind('click',function(){
                showDepaermentModal();
                notice.modals.managementsModal.modal('show')
                var noticedids=[];
                com.post(api.information.queryNoticeDepartment, {"notice.nid": v.nid},function(res){
                    $.each(res.noticeDepartments,function(i,val){
                        noticedids[i]=(val.did);
                        $wrap.find('input[value="'+ val.did +'"]').prop('checked', true);
                    });
                });

                com.focusPage("#manageBtn").unbind().bind('click',function(){
                    var list = com.focusPage('input[name="module"]:checked', com.focusPage('#managements'));
                    var params = {"notice.nid": v.nid};

                    if(list.length > 3){
                        com.showAlert(com.warning, "部门数量最多3个");
                        return false;
                    }

                    var checkedDepts = com.focusPage('input[name="module"]:checked').parents('.dd-handle');

                    var dept =[];

                    $.each(checkedDepts, function(i, v){

                        dept[i] = $(this).text();

                    })

                    var depts = dept.join('-');

                    list.length && (
                        $.each(list, function(i, v){

                            var $v = $(this).val();

                            params["dids" + "[" + i + "]"] = $v;
                            params["notice.depts"] = depts;

                            if($v == -1 || $v == '全部')
                                return false;
                        }),
                        com.post(api.information.updateNoticeDepartment, params,function(res){
                            notice.modals.managementsModal.modal("hide");
                            NoticeMngSeacher.doSearch();
                        }, null, false)
                    );
                });
            });

            $btnDel.click(function(){
                com.showConfirm("确定删除吗?", function() {
                    removeRow(v.nid);
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

    var NoticeMngSeacher = new Searcher();
    NoticeMngSeacher.init(['theme', 'dateRange'], "condList", api.information.pageNotice, function(list){
        displayFunc.init('resultList', list);
    }, "pagenation", "noticeMngSeacherPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addMng').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage("#addMng").click(function() {
        notice.editFlg = false;
        notice.modals.noticeModal.modal("show");
    });

    function saveData() {
        if (com.validate('form')) {
            return false;
        }
        if (notice.items.startTime.val() > notice.items.endTime.val()) {
            com.showAlert(com.warning,"结束时间不能小于开始时间");
            return false;
        }

        var url;
        var options = {
            "notice.nid":notice.items.nid,
            "notice.theme": notice.items.theme.val(),
            "notice.type": notice.items.typeSel.val(),
            "notice.priority": notice.items.prioritySel.val(),
            "notice.creater.userId": notice.items.userId,
            "notice.startTime": notice.items.startTime.val(),
            "notice.endTime": notice.items.endTime.val(),
            "notice.isPublic": notice.items.isPublic.prop("checked") ? 0 : 1,
            "notice.contents": notice.items.contents.val(),
            "notice.filePath": notice.items.filePath.val(),
            "notice.fileName": notice.items.fileName.val()
        };

        notice.editFlg ? (url = api.information.updateNotice,options["notice.noticeId"] = notice.items.noticeId) : url = api.information.addNotice;

        com.post(url, options, function successCallback() {
            com.showAlert(com.info, "操作成功");
            NoticeMngSeacher.doSearch();
        });
        notice.modals.noticeModal.modal("hide");
     }

    function removeRow(id) {
        com.post(api.information.deleteNotice, {"notice.nid" : id}, function successCallback() {
            com.showAlert(com.info, "操作成功");
            NoticeMngSeacher.doSearch();
        });
    }

    function bindUploadfiy() {
        com.focusPage("#attachment").Huploadify({
            fileTypeExts: '*.pdf',
            fileSizeLimit: '5MB',
            auto: true,
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
            'multi': false,
            onUploadSuccess: function(a, b, c) {
                a = eval("(" + b + ")");
                0 == a.errorCode ? com.focusPage("#filePath").val(a.resUrl) : alert(b);
                0 == a.errorCode ? com.focusPage("#fileName").val(a.strutsUploadsFileName) : alert(b);
            },
            itemTemplate: '<div id="${fileID}" class="uploadify-queue-item"><div class="uploadify-progress" style="width: 75px;"><div class="uploadify-progress-bar"></div></div><span class="up_filename">${fileName}</span><br/><span class="uploadbtn">上传</span><span class="delfilebtn">删除</span></div>'
        });
    };

    function showDepaermentModal() {
        $wrap = com.focusPage('#managements').find('.modal-body').empty();

        com.post(api.communion.queryDepartment, {}, function (res) {
            var treeData = res.deptList;
            if (!treeData || !treeData.length) {
                return;
            }
            var menuArr = {
                level1 : [],
                level2 : [],
                level3 : [],
            };
            var menuObj = {
                level1:{},
                level2 : {},
                level3 : {},
            };
            var $tree = $('<ol class="dd-list"></ol>');

            $wrap.append($tree);

            menuArr.level1=[{did: -1, deptName: "全部"}];

            $.each(treeData,function(i,v){
                if(v.fatherDept.did == null || v.fatherDept.did == 0){
                    menuArr.level2.push(v);
                }
            });

            $.each(menuArr.level2,function(i,v){
                $.each(treeData,function(index,value){
                    if(value.fatherDept != null) {
                        if (value.fatherDept.did == v.did) {
                            menuArr.level3.push(value);
                        }
                    }
                });
            });

            if (menuArr.level1.length) {
                $.each(menuArr.level1, function (i, v) {
                    var $li = $('<li></li>').addClass('dd-item');
                    var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name);
                    var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({'margin-bottom': '0', 'margin-top': '-5px'});
                    var $label = $('<label></label>').append('<span class="lbl"></span>');
                    $indexCheck.append($label).appendTo($div);
                    $li.append($div).appendTo($tree);
                    menuObj.level1[v.did] = $li;
                });
            }

            if (menuArr.level2.length) {
                $.each(menuArr.level2, function (i, v) {
                    var $li = $('<li></li>').addClass('dd-item');
                    var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name);
                    var $input = $('<input>').attr({type: 'checkbox', name: 'module'}).addClass('ace').val(v.did);
                    var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({'margin-bottom': '0', 'margin-top': '-5px'});
                    var $label = $('<label></label>').append($input).append('<span class="lbl"></span>');
                    $indexCheck.append($label).appendTo($div);
                    menuObj.level2[v.did] = $li;
                    $li.append($div);

                    var $parent = menuObj.level1[-1];
                    $parent.children('div').hasClass('btn-default') || $parent.children('div').addClass('btn-default');
                    if (!$parent.children('button').length) {
                        var $title = $parent.children('div');
                        $('<button type="button" data-action="collapse" class="minus hide">Collapse</button>').insertBefore($title);
                        $('<button type="button" data-action="expand" class=" plus">Expand</button>').insertBefore($title);
                    }

                    var $pol = $parent.children('ol').length ? $parent.children('ol') : $('<ol></ol>').addClass('dd-list hide').appendTo($parent);
                    $li.appendTo($pol);
                });
            }

            if (menuArr.level3.length) {
                $.each(menuArr.level3, function (i, v) {
                    if(v != null) {
                        var $li = $('<li></li>').addClass('dd-item');
                        var $div = $('<div></div>').addClass('dd-handle clearfix').text(v.name);
                        var $input = $('<input>').attr({type: 'checkbox', name: 'module'}).addClass('ace').val(v.did);
                        var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({'margin-bottom': '0', 'margin-top': '-5px'});
                        var $label = $('<label></label>').append($input).append('<span class="lbl"></span>');
                        $indexCheck.append($label).appendTo($div);
                        menuObj.level3[v.did] = $li;
                        $li.append($div);

                        var $parent = menuObj.level2[v.fatherDept.did];
                        $parent.children('div').hasClass('btn-default') || $parent.children('div').addClass('btn-default');
                        if (!$parent.children('button').length) {
                            var $title = $parent.children('div');
                            $('<button type="button" data-action="collapse" class="minus">Collapse</button>').insertBefore($title);
                            $('<button type="button" data-action="expand" class="hide plus">Expand</button>').insertBefore($title);
                        }

                        var $pol = $parent.children('ol').length ? $parent.children('ol') : $('<ol></ol>').addClass('dd-list hide').appendTo($parent);
                        $li.appendTo($pol);
                    }
                });
            }
            com.focusPage('button[data-action="collapse"]').click(function () {
                var $this = $(this);
                $this.siblings('ol').addClass('hide');
                $this.parent().find('.plus').toggleClass('hide');
                $this.parent().find('.minus').removeClass('hide');
                $this.siblings('ol').find('.dd-list').addClass('hide');
                $this.toggleClass('hide');
            });

            com.focusPage('button[data-action="expand"]').click(function () {
                var $this = $(this);
                $this.siblings('ol').removeClass('hide');
                $this.parent().find('.minus').toggleClass('hide');
                $this.parent().find('.plus').removeClass('hide');
                $this.toggleClass('hide');
            });

        }, null, false);

    }
});
