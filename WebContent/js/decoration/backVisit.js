/**
 * Created by Administrator on 2016/5/30 0030.
 */

$(function(){
    var TimeLine = (function(){
        var basicConf = {
            postParams : {},
            historyPage : ""
        };
        var painter = {
            renderList : function(list){
                var that = this;
                var $list = com.focusPage('#backVisitList');
                $list.empty();
                if(list.length){
                    $.each(list, function(i,v){
                        var $item = that.createItem(v);
                        $list.append($item);
                    });
                }
            },
            createItem : function(v){

                var $item = $('<div></div>').addClass('timeline-item clearfix');

                var $info = $('<div></div>').addClass('timeline-info');

                var $infoImg = $('<img>');
                var $box = $('<div></div>').addClass('widget-box transparent');
                var $bheader = $('<div></div>').addClass('widget-header widget-header-small');
                var $name = $('<h5></h5>').addClass('smaller').html(v.sender);
                var $time = $('<div></div>').addClass('widget-toolbar no-border').append('<i class="icon-time bigger-110"></i>').append(v.createTime);
                var $bbody = $('<div></div>').addClass('widget-body');
                var $bmain = $('<div></div>').addClass('widget-main').html(v.content);
                
                com.showImg($infoImg, v.senderPhoto, 32, 32, v.sender, 'assets/ace/images/avatar2.png');

                $info.append($infoImg);
                $bheader.append($name).append($time);
                $bbody.append($bmain);
                $box.append($bheader).append($bbody);
                $item.append($info).append($box);

                return $item;
            }
        };

        var getList = function(){
            com.post(api.decoration.queryBackVisitByOrderId, basicConf.postParams, function(data){
                painter.renderList(data.backVisits);
            });
        };
        return {
            init : function(){
                basicConf.postParams = {"backVisit.orderId" : params.decorationOrderId};
                basicConf.historyPage = params.historyPage;
                
                getList();

                //动态key val
                var tag_input = com.focusPage('#form-field-tags');

                tag_input.tag({
                    placeholder:tag_input.attr('placeholder'),
                    //enable typeahead by specifying the source array
                    isStaticResource : false,
                    flsource: {
                        url : api.personel.queryUserByPinyin,
                        postData : {"duty": "", "user.status":0},
                        resultList : "autoFillKeyValue",
                        keyPath : "key",
                        valuePath : "value",
                        isResultTypeMap : true, //是否是key - value 形式的列表
                    },
                });
            },
            getList : function(){
                getList();
            }
        };
    })();
    
    TimeLine.init();

    var backVisit = {
        $saveBtn : com.focusPage('#saveBtn').on('click', saveData),
        modal : com.focusPage("#backVisitModal"),
        $addBtn : com.focusPage('#add').click(function(){
            com.clearValidator();
            com.cleanItems(backVisit.backVisitItems);
            backVisit.backVisitItems.backVisitContent.get(0).selectedIndex = 0;
            backVisit.modal.modal("show");
        }),
        backVisitItems : {
            backVisitContent : com.focusPage('#backVisitContent'),
            backVisitNoticePeople : com.focusPage('#form-field-tags')
        }
    };

    com.focusPage('#btnBack').click(function(){
        com.switchPage(params.historyPage);
    });

    function saveData() {
        if (!com.validate()) {
            var a = {
                "backVisit.orderId" : params.decorationOrderId,
                "backVisit.content": backVisit.backVisitItems.backVisitContent.val()
            };
            var _people = backVisit.backVisitItems.backVisitNoticePeople.val().split(',');
            _people.length && $.each(_people, function(i,v){
                if($.trim(v) != ""){
                    a['backVisit.receivers[' + i + ']'] = v;
                }
            });

            com.post(api.decoration.addBackVisit, a, successCallback);
        }
    }
    
    function successCallback(a) {
        0 == a.errorCode && (com.showAlert(com.info, "\u64cd\u4f5c\u6210\u529f"), TimeLine.getList(), backVisit.modal.modal("hide"));
    }

});
