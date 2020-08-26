jQuery(function($) {

    var initList = function (listData) {

        var $tableWrap = com.focusPage('#list').empty();
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if(!listData.length){
        	
            var $resultList = com.focusPage("#list").addClass('dz-default dz-message').html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            return $resultList;
            
        }else if (listData && listData.length) {

            $.each(listData, function (i, v) {
        
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html(' ' + v.type);
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                
                var propertyArr = [
                    ["类型:", v.type, "red"],
                    ["备注:", v.comment, "grey"],
                    ["调动时间:",v.operateTime,"green"],
                    ["创建时间:",v.createTime,"green"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);
                $h3.append($title);

            });
            $ul.appendTo($tableWrap);
        }
    };
    



    com.post(api.personel.queryUserExperienceByUid,{"userExperience.uid": params.uid}, function (data) {
        initList(data.userExperiences);
    }, function (e) {
        com.showAlert(com.error, e.errorMsg);
    }, false);
});
