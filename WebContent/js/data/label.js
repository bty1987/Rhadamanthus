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

    var displayFunc = (function(){
        var renderList = function(tableId, listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData, function(i, v){
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right cation-buttons');

                    var $btnDel = $('<input />').attr("type","checkbox").addClass('ace ace-switch ace-switch-5').attr("checked", v.status == 0 ? true : false);
                    var $btnView= $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑");
                    var $btnSpan = $('<span></span>').addClass("lbl status-lbl");

                    var labelArr = [
                        ["类型:", type[v.type] , "grey"],
                        ["比例:", v.scale, "blue"]
                    ];

                    $.each(labelArr, function(index, value){
                       var $liLabel = $('<li></li>');
                       $('<strong></strong>').html(value[0]).appendTo($liLabel);
                        $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liLabel);
                        $liLabel.appendTo($ulProperty)
                    });

                    $divBtnWrap.append($btnDel).append($btnSpan).append($btnView).appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);

                    $btnDel.click(function(){
                        var cvalue = $btnDel.prop("checked");
                        if(cvalue){
                            cvalue = 0;
                        }else{
                            cvalue = 1;
                        }
                        updatastatus(v.lid, cvalue);
                    });

                    $btnView.click(function(){
                        editlabel(v);
                    })
                });
                $ul.appendTo($tableWrap);
            }
        };

        return {
            init : function(tableId, listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        }
    })();

    var labelSearcher = new Searcher();

    labelSearcher.init(["labelname"], "condList", api.data.pageLabel, function(data){
        displayFunc.init('resultList',data);
    },'pagenation', "label", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addlabel').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

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
        if(com.validate())
            return;

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