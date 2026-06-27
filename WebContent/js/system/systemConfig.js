$(function(){

    var system = {
            
        items: {
            key: com.focusPage("#key"),
            value: com.focusPage("#value"),
            comment: com.focusPage("#comment"),
        },
        
        btns: {
            saveBtn: com.focusPage('#saveBtn').on("click",saveData),
            cancellBtn: com.focusPage("#cancelBtn"),
        },
        
        modals: {
            modal: com.focusPage("#system")
        },
            
        scid: null,
    };

    function buildSystemConfigLineprops() {

        return [{
            field: "createName",
            name: "创建人",
            prop: "createName",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "grey"
        }, {
            field: "comment",
            name: "说明",
            prop: "comment",
            clazz: "grey"
        }];
    }

    function buildSystemConfigLinebtns() {

        return {
            draw: {
                name: "更新",
                clazz: "btn-yellow",
                handle: function(v) {
                    edit(v);
                }
            }
        };
    }

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.system.pageSystemConfig, null, ['system-config', 'system-company'], null, null, false, null);
    searcher.line(function(v) { return "KEY :  " + v.key + "      Value :  " + v.value; }, buildSystemConfigLineprops(), buildSystemConfigLinebtns()).render();

    //编辑
    function edit(row){
    	//给页面标签赋值
    	
    	system.scid = row.scid;
    	
        system.items.key.val(row.key);
		system.items.value.val(row.value);
		system.items.comment.val(row.comment);

		system.modals.modal.modal("show"); //弹出弹层
    }

    com.focusPage('[name="systemConfig"]', com.focusPage('#pagenation')).on("click",function(){
        com.cleanItems(system.config);
        system.modals.modal.modal('show');
    });

    function saveData(){
        
        if(com.validate("system")){
            return false;
        }

        var key = system.items.key.val();
        var value = system.items.value.val();
        
        var options = {
        	"systemConfig.scid": system.scid,
            "systemConfig.key" : system.items.key.val(),
            "systemConfig.value": system.items.value.val(),
            "systemConfig.comment": system.items.comment.val(),
        };

        com.post(api.system.updateSystemConfig, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        
        system.modals.modal.modal('hide');
    }

})