jQuery(function($) {
    var checkUser={
        userPhoto:"",
        name : "",
        btnyes : null,
        profiles : null,
        userid : null,
        btnno : null,
        returnBtn : null,
        tempUserId: params.tempUserId,
        currentUid: params.uid
    };

    com.focusPage('#fl-statement').statement("人员资料", "编辑资料");

    checkUser.btnyes = com.focusPage(".yes").on("click",updateprofiles);
    checkUser.btnno = com.focusPage(".no").on("click",removeprofiles);

    com.post(api.personel.queryUserInfoByUserId, {"userInfo.user.userId": checkUser.tempUserId}, function(res){
        checkUser.name=res.userInfo.user.userName;
        checkUser.userPhoto=(res.userInfo.user.userPhoto == null ? " " : res.userInfo.user.userPhoto);
        checkUser.profiles = res.userInfo.profiles;
        com.focusPage("#content").html(checkUser.profiles);
        com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), checkUser.userPhoto, 150, 150, ''));
        com.focusPage("#name").html(checkUser.name);
        checkUser.userid=res.userInfo.user.userId;

        com.post(api.data.queryUserLabelByUid, {"userlabel.user.uid" : res.userInfo.user.uid}, function(res){
            $.each(res.userlabels, function(i, v){
                if(v.label.isShow == 0){
                    var $draw = ('标签名称:  '+ v.label.name+'<div class="progress" data-percent="'+ v.scope+'%'+'"><div class="progress-bar" style="width:'+ v.scope+'%'+';"></div></div>')
                    com.focusPage("#astrict").append($draw);
                }
            })
        });

        var propertyArr = [
            ["年龄", "age", res.userInfo.age],         // name aid value inputId
            ["电话", "phone",com.checkNull(res.userInfo.user.phone, "空")],
            ["QQ", "qq", com.checkNull(res.userInfo.qq, "空")],
            ["微信", "whchat", com.checkNull(res.userInfo.wechat, "空")],
            ["邮箱", "email", com.checkNull(res.userInfo.email, "空")],
            ["紧急联系人", "emergencyMan", com.checkNull(res.userInfo.emergencyMan, "空")],
            ["联系电话", "emergencyPhone", res.userInfo.emergencyPhone]
        ];

        var $striped = $('<div class = "profile-user-info profile-user-info-striped"></div>').appendTo(com.focusPage("#all"));

        var $btn=$('<button class = "btn btn-info">编辑个人简介</button>').css('float','right') .appendTo(com.focusPage("#whis"));

        com.focusPage("#btn").css("display","none");

        $.each(propertyArr, function (i, v) {
            var $row = $('<div class = "profile-info-row"></div>').css("height","35px");
            var $name = $('<div class = "profile-info-name">'+ v[0] +'</div>');
            var $value = $('<div class = "profile-info-value"></div>');
            var $a = $('<p href="#" class = "editable" id="'+ v[1] +'">'+ v[2] +'</p>');
            $row.append($name).append($value.append($a)).appendTo($striped);
        });

        $btn.click(function(){
            com.focusPage("#text").css("display","block");
            com.focusPage("#content").css("display","none");
            com.focusPage("#btn").css("display","block");
            com.focusPage("#text").val(com.focusPage("#content").html());
        });
        //$content.appendTo($("#profiles"));
    });

    com.focusPage("#returnBtn").click(function(){
        com.switchPage(api.index.userLabel.url);
    });

    function updateprofiles(){
        var option={
            "userInfo.user.userId" : checkUser.userid,
            "userInfo.profiles" : com.focusPage("#text").val()
        };
        com.post(api.personel.updateUserForProfile, option, function(){
            com.post(api.personel.queryUserInfoByUserId, {"userInfo.user.userId" : checkUser.userid}, function(res){
                com.focusPage("#content").html(res.userInfo.profiles);
            });
            com.showAlert(com.info, "编辑个人简介成功");
            select(com.focusPage("#text"), com.focusPage("#btn"), com.focusPage("#content"));
        });
    }

    function removeprofiles(){
        select(com.focusPage("#text"), com.focusPage("#btn"), com.focusPage("#content"));
        com.post(api.personel.queryUserInfoByUserId, {"userInfo.user.userId": checkUser.tempUserId}, function(res){
            com.focusPage("#content").html(res.userInfo.profiles);
        })
    }

    function select(textid, btnid, contentid){
        textid.css("display","none");
        btnid.css("display","none");
        contentid.css("display","block");
    }
});