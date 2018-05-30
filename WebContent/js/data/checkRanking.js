jQuery(function($){
    var checkuserlabel = {
        userPhoto:"",
        profiles : null,
        userId : null,
        styleType : null,
        areaType : null,
        housesType : null,
        ageType : null,
    }

    checkuserlabel.check = $("#check").on('click',checkuser);

    selectlabel($("#styleType"),0)
    selectlabel($("#areaType"),1)
    selectlabel($("#housesType"),2)
    selectlabel($("#ageType"),3)

    function selectlabel(id,type){
        com.post(api.data.querylabelBytype, {"label.type" : type,"label.status" : 0}, function(res){
            $(id).bindData(res.labels,'lid','name')
        })
    }

    function checkuser(){
        $(".rem").remove();

        $("#userlabel").css("display","block")

        checkuserlabel.ageType = $("#ageType").val()
        checkuserlabel.housesType =  $("#housesType").val()
        checkuserlabel.areaType = $("#areaType").val()
        checkuserlabel.styleType =  $("#styleType").val()

        var userlabels = null;
        var profiles =null;
        com.post(api.data.queryUserLbaelBylids,{"lids[0]":checkuserlabel.styleType, "lids[1]":checkuserlabel.areaType, "lids[2]": checkuserlabel.housesType,"lids[3]":checkuserlabel.ageType}, function(res){
            if(res.userlabels == null || res.userlabels.length ==0 ){
                layer.msg("没有符合的人员");
            }
            userlabels = res.userlabels;

        },null,false)
        $.each(userlabels, function(i, v){
            checkuserlabel.userId = v.user.userId

                checkuserlabel.userPhoto=(v.user.userPhoto == null ? " " : v.user.userPhoto);

            var $li=drawlnke(v);
            $li.appendTo($("#userlabel"));
        })
    }

    function drawlnke(v){

        var $row = $('<div class="col-md-4 rem" style="border-right: 1px solid #c5d0dc; text-align:center"></div>');
        var $bolk = $(' <div class="block clearfix form-group" ></div>').css("margin-left","175px");
        //var $label = $('<label class="col-md-3 control-label no-padding-right " for="picture">个人图片</label>');
        var $right = $(' <div class="col-md-5 block no-padding-right"></div>');
        var $flud = $('<div class="col-md-12 row-fluid"></div>');
        var $ul = $('<ul class="ace-thumbnails"></ul>');
        var $li = $('<li></li>');
        var $div = $('<div></div>').css("width","150px").css("height","150px");
        var $img = $('<img id="showImg" src="#" alt="150x150">');
        var $clearfix = $('<div class="profile-activity clearfix" style="text-align:center" >姓名:<span>'+v.user.userName+'</span></div>');
        var $clearfix2 = $('<div class="profile-activity clearfix" style="text-align:center" >总分数<span>'+v.value+'</span></div>');

        $(".hr").after($row)
        $row.append($bolk.append($right.append($flud.append($ul.append($li.append($div.append($img)))))))

        $row.append($clearfix).append($clearfix2);

        $("#infoPicture").attr("href", com.showImg($("#showImg"), checkuserlabel.userPhoto, 150, 150, ''));

        return $row
    }
})