$(function(){

    var group = {
        addmodal : null,
        groupadd : {},
        cancelBtn : null,
        savebtn : null,
        editFlg : false,
        validator: {
            
            drawlingroup: {
                type: "v_drawlingroup",
                regex: /^([\u4e00-\u9fa5][\u4e00-\u9fa5][\u653e][\u7ebf][\u5c0f][\u7ec4])|([\u653e][\u7ebf][\u4e00|\u4e8c|\u4e09|\u56db|\u4e94|\u516d|\u4e03|\u516b|\u4e5d|\u5341]{1,2}[\u7ec4])$/,
                errorMsg: "放线小组不能重复且为中文 例 放线x组,放线x-xx组"
            },

        }
    }

    group.cancelBtn = com.focusPage("#cancelBtn");
    group.groupadd.gid = com.focusPage("#gid");
    group.addmodal = com.focusPage("#addModal");
    group.groupadd.drawLineGroup = com.focusPage("#drawLineGroup");
    group.groupadd.contentadd = com.focusPage("#contentadd");
    //添加的保存按钮
    
    $.extend(com.validator, group.validator);
    group.savebtn = com.focusPage("#groupadd").on("click", saveData);

    var lineprops = (function() {

        return [{
            field: "content",
            name: "说明",
            prop: "content",
            clazz: "grey",
            show: function(v) { return !!v.content; }
        }];
    })();

    var linebtns = (function() {

        return {
            status: {
                type: "switch",
                clazz: "status-lbl",
                init: function(v) { return !v.status; },
                handle: function(v, checked) { updateStatus(v.gid, checked ? 0 : 1, null); }
            },
            edit: {name: "编辑", clazz: "btn-yellow", handle: function(v) { update(v); }}
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addGroup').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();
    searcher.set("condList", "pagenation", "resultList", api.data.pageDrawlineGroup, null, ['data-drawline-group-name'], "groupPostData", null, false, buttons);
    searcher.line(function(v) { return ' ' + v.name; }, lineprops, linebtns).render();

    function popoverInit(){
        com.focusPage("[data-toggle='popover']").popover({
            html : true,
            trigger:'blur',

        });
        com.focusPage('#drawLineGroup').css('border-color', '');

    }

    //添加按钮
    com.focusPage('a[name="addGroup"]','#pagenation').click(function(){
        group.editFlg = true;
        com.cleanItems(group.groupadd);
        group.addmodal.modal("show");
        popoverInit();
    });

    function saveData(){
    	
    	if( !com.validate("addModal")) {
    		var url;
    	
    		var options = {
                "drawLineGroup.gid" : group.groupadd.gid.val(),

                "drawLineGroup.name": group.groupadd.drawLineGroup.val(),

                "drawLineGroup.content": group.groupadd.contentadd.val(),

            };
                
    		if(group.editFlg){
    			url = api.data.addDrawlineGroup;
    		}else{
    			url = api.data.updateDrawlineGroup;
    		}
    	
    		com.post(url, options, function (res) {
                    //刷新页面所有条件,点击保存之后 刷新页面条件 重新载入
    		com.showAlert(com.info, "操作成功");
    		searcher.doSearch();
    		},function(){
    			com.showAlert(com.error, "放线小组已存在");
    			
    		});
                //隐藏动态框
    		group.addmodal.modal("hide");
    	 }
            
	}

    function update(v){
        group.editFlg = false ;
        com.cleanItems(group.groupadd);
        group.groupadd.gid.val(v.gid);
        group.groupadd.drawLineGroup.val(v.name);
        group.groupadd.contentadd.val(v.content);
        group.addmodal.modal("show");
        popoverInit();

    }

    function updateStatus(id, status, failcallBack){
        com.post(api.data.updateDrawlineGroupForStatus, {"drawLineGroup.gid" : id, "drawLineGroup.status" : status}, function(){

        },function(){
            failcallBack && failcallBack();
        });
    }

})