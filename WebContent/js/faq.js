$(function() {

    var creatLine = function(list, v) {

        var oneDiv = $('<div class="panel panel-default"></div>').appendTo(com.focusPage(".list" + v.atttype));
        var twoDiv = $('<div class="panel-heading"></div>').appendTo(oneDiv);
        var aTag = $('<a href="#faq-1-1" data-parent="#faq-list-1" data-toggle="collapse" class="accordion-toggle collapsed"></a>').appendTo(twoDiv);
        var iTag = $('<i class="icon-chevron-left pull-right"></i>').appendTo(aTag);
        var iTag1 = $('<i class="icon-bookmark-empty" style="margin-right:3px"></i>').appendTo(aTag);
        var spannoborder = $('<span></span>').html(v.name).appendTo(aTag);

        var threeDiv = $('<div class="panel-body" style="display:none"></div>').appendTo(oneDiv);

        var tag = 0;
        var tag1 = 0;

        twoDiv.click(function() {

            if (tag == 0) {

                iTag.attr({
                    'class': 'icon-chevron-down pull-right'
                });
                iTag1.attr({
                    'class': 'icon-bookmark'
                });
                threeDiv.attr({
                    'style': 'display:block'
                });
                tag = 1;
            } else if (tag == 1) {
                iTag.attr({
                    'class': 'icon-chevron-left pull-right'
                });
                iTag1.attr({
                    'class': 'icon-bookmark-empty'
                });
                threeDiv.attr({
                    'style': 'display:none'
                });
                tag = 0;
            }

            if (tag1 == 0) {
                com.post(api.data.queryAssistanceItem, {
                    "assistance.aid": v.aid
                }, function(res) {

                    var fourDiv = $('<div class="panel-group accordion-style1 accordion-style2"></div>').attr("id", "faq-list-nested-" + v.aid).appendTo(threeDiv);

                    $.each(res.assistanceItems, function(i, v) {

                        var fiveDiv = $('<div class="panel panel-default"></div>').appendTo(fourDiv);
                        var sixDiv = $('<div class="panel-heading"></div>').appendTo(fiveDiv);
                        var aTag2 = $('<a data-toggle="collapse" class="accordion-toggle"></a>').attr("data-parent", "#faq-list-nested-" + v.aid).attr("href", "#faq-list-" + v.aid + "-sub-" + v.aiid).appendTo(fiveDiv);
                        var iTag2 = $('<i class="smaller-80 icon-minus" style="margin-right:3px"></i>').appendTo(aTag2);
                        var spannoborder1 = $('<span></span>').html(v.title).appendTo(aTag2);

                        var sevenDiv = $('<div class="panel-collapse in" style="height: auto;"></div>').attr("id", "faq-list-" + v.aid + "-sub-" + v.aiid).appendTo(fiveDiv);

                        var eightDiv = $('<div class="panel-body no-border"></div>').appendTo(sevenDiv);
                        var nineDiv = $('<div class="clearfix timeline-item"></div>').appendTo(eightDiv);
                        var tenDiv = $('<div class="col-xs-9 pull-left"></div>').html(v.content).appendTo(nineDiv);
                        var elevenDiv = $('<div class="col-xs-3 pull-right draw" style="text-align: right;"></div>').appendTo(nineDiv);

                        $.each(v.drawings, function(j, value) {

                            var img = $('<img class="photo" style="margin-left: 3px; border: 1px solid #000000" width="36" />').appendTo(elevenDiv);
                            com.showImg(img, value.drawingUrl, 36, 36, '', null, 0);
                        });

                        com.popup4photos(com.focusPage(".draw"));
                    });

                });
                tag1 = 1;
            }

        });

        return oneDiv;
    };

    com.post(api.data.queryAssistance, {}, function(res) {

        $.each(res.assistances, function(i, v) {

            if (com.focusPage(".list" + v.atttype)) {
                creatLine(com.focusPage(".list" + v.atttype), v);
            }
        });

    });
});
