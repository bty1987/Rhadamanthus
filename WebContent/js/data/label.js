$(function(){
    var type={};
    var createlabel = {
        items:{},
        modal: null,
        saveLbaleBtn : null
    };
    createlabel.items.labelName = com.focusPage("#name");
    createlabel.items.type = com.focusPage("#labeltype");
    createlabel.items.scale = com.focusPage("#labelscale");
    createlabel.items.yes = com.focusPage("#yes").switchBtn("isOrNot");

    com.post(api.ds.data,{}, function(res){
        com.focusPage("#type").bindData(res.labeltype,"key","value");
        createlabel.items.type.bindData(res.labeltype,"key","value");
        $.each(res.labeltype,function(i,v){
            type[v.key]=v.value;
        })
    },null,false);

    var lineprops = (function() {

        return [{
            field: "type",
            name: "类型",
            prop: function(v) { return type[v.type]; },
            clazz: "grey"
        }, {
            field: "scale",
            name: "比例",
            prop: "scale",
            clazz: "blue"
        }];
    })();

    var linebtns = (function() {

        return {
            status: {
                type: "switch",
                init: function(v) { return v.status == 0; },
                handle: function(v, checked) {
                    updatastatus(v.lid, checked ? 0 : 1);
                }
            },
            edit: {name: "编辑", clazz: "btn-yellow", handle: function(v) { editlabel(v); }}
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addlabel').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var labelSearcher = new Searcher();

    labelSearcher.set("condList", "pagenation", "resultList", api.data.pageLabel, null, ["personel-label-name"], "label", null, false, buttons);
    labelSearcher.line("name", lineprops, linebtns).render();

    com.focusPage('a[name="addlabel"]', '#pagenation').click(function(){
        com.focusPage("#labelName").val("");
        com.focusPage("#labelModal").modal("show");
    });

    com.post(api.ds.data, {}, function(res){
        com.focusPage("#type").bindData(res.labeltype, 'key', 'value');
    });

    function updatastatus(labelId, cvalue){
        var options = {};
        options["label.lid"] = labelId;
        options["label.status"] = cvalue;

        com.post(api.data.updateLabelForStatus, options, function(res){
            labelSearcher.doSearch();
        })
    }

    com.focusPage("#saveBtn").on('click', function(){
        
        if(com.validate("labelModal")) return false;

        var $_modalBody = com.focusPage('.modal-body');
        var type = $_modalBody.find('select[name="type"] option:selected').val();

        var options = {
            "label.name" : com.focusPage("#labelName").val(),
            "label.type" : type,
            "label.scale":com.focusPage("#scale").val()
        };

        com.post(api.data.addLabel, options, function(res){
            labelSearcher.doSearch();
            com.clearValidator("#type", true);
            com.clearValidator("#labelName", true);
            com.showAlert(com.info, "添加成功");
            com.focusPage("#scale").val("")

        });
        com.focusPage("#labelModal").modal("hide");
    });

    function editlabel(v){
        createlabel.items.lid = v.lid;
        createlabel.items.labelName.val(v.name);
        createlabel.items.type.val(v.type);
        createlabel.items.scale.val(v.scale);

        if(v.isShow == 0){
            createlabel.items.yes.prop("checked",true);
        }else{
            createlabel.items.yes.prop("checked",false);
        }
       // createlabel.items.yes.prop("checked", com.isOrNotType[v.isShow]);
        com.focusPage("#LbaleModal").modal("show");
    }

    com.focusPage("#saveLbaleBtn").on('click', function(){
        var option = {
            "label.lid" : createlabel.items.lid,
            "label.name" :  com.focusPage("#name").val(),
            "label.scale" : com.focusPage("#labelscale").val(),
            "label.type" : com.focusPage("#labeltype").val(),
            "label.isShow" : createlabel.items.yes.prop("checked")? 0 : 1
        };

        com.post(api.data.updateLabel, option, function(){
            labelSearcher.doSearch();
            com.showAlert(com.info,'修改成功');
            com.focusPage("#LbaleModal").modal("hide");
        })
    })
});