$(function() {

    var chatGpt = {
        items: {
            message: com.focusPage("#message", "#chatGpt")
        },
        btns: {
            sendBtn: com.focusPage("#send", "#chatGpt")
        }
    };

    chatGpt.btns.sendBtn.click(sendMessage);

    com.focusPage("#message").keyup(function (event) {
        if (event.keyCode == 13) {
            sendMessage();
        }
        return false;
    });

    function sendMessage() {
        var content = chatGpt.items.message.val().replace(/\s+/g, "");

        if (content == "") {
            com.showAlert(com.warning, "请描述你的问题...");
            return false;
        }

        var data = {
            "name": params.userInfo.user.currentName,
            "url": params.userInfo.user.userPhoto,
            "time": com.currentTime(),
            "content": content
        };

        drawDialog(data, true);

        var options = {
            "api": "chatGPT.chatGPT.chat",
            "userId": params.userInfo.user.userId,
            "question": content,
            "redis": 0
        };

        com._post_(api.home.library, options, function(res) {

            data["name"]  = "方木木";
            data["url"]  = null;
            data["content"]  = res.code == 0 ? res.content : "对不起, 这个问题我还需要再学习一下!";

            drawDialog(data, false);
        }, function(error){

            data["name"]  = "方木木";
            data["url"]  = null;
            data["content"]  = "对不起, 这个问题我还需要再学习一下!";

            drawDialog(data, false);
        });

        com.cleanItems(chatGpt.items);

        return false;
    }

    function drawDialog(data, flag) {
        var $div = $('<Div></Div>').addClass('itemdiv dialogdiv dialogdivNoline').appendTo(com.focusPage("#dialogs"));

        var $userDiv = $('<Div></Div>');
        var $img = $('<img alt="head portrait"/>').appendTo($userDiv);
        var $url = com.showImg($img, data.url, 75, 75, '', 'assets/ace/images/avatar2.png', 0);

        var $bodyDiv = $('<Div></Div>').addClass('body').css("width", "40%");

        var $timeDiv = $('<Div></Div>').addClass('time').appendTo($bodyDiv);
        var $timeI = $('<i></i>').addClass('icon-time').appendTo($timeDiv);
        var $timeSpan = $('<span></span>').addClass('green').html(data.time).appendTo($timeDiv);

        var $nameDiv = $('<Div></Div>').addClass('name').appendTo($bodyDiv);
        var $nameA = $('<a></a>').html(data.name).appendTo($nameDiv);

        var $textDiv = $('<Div></Div>').addClass('text').html(data.content).appendTo($bodyDiv);

        if (flag) {
            $userDiv.addClass('user userRight');
            $bodyDiv.addClass("body bodyRight");
            $bodyDiv.css({"margin-left": "12px", "margin-right": "50px", "float": "right"});
        } else {
            $userDiv.addClass('user');
            $bodyDiv.addClass("body");
            $bodyDiv.css({"margin-left": "50px", "margin-right": "12px"});
        }

        $div.append($userDiv).append($bodyDiv);

        window.scrollTo(0, com.focusPage('#dialogs')[0].scrollHeight)
    }
});