/**
 * Created by Administrator on 2016/10/12.
 */
$(function(){

    var cookies = document.cookie.split(";");
    var cookie;
    for(var i=0;i<cookies.length;i++){
        cookie = cookies[i];

        if(cookie.indexOf("versionCode") != -1){
            versionCode = cookie.split("=")[1];
        }else if(cookie.indexOf("authentication") != -1){
            window.authentication = cookie.split("=")[1];
        }else if(cookie.indexOf("loginTime") != -1){
            window.loginTime = cookie.split("=")[1];
        }
    }

    params.authentication = window.authentication;
    params.loginTime = window.loginTime;


    var id = (window.location.hash).substr(1);
    id && id.length && (id = id.split('=')[1]);
    var mtypeList = [
        '进货',//1
        '进退',//2
        '出货',//3
        '出返',//4
        '调拨',//5
    ];

    //获取货单信息
    var df1 = com.post(api.inventory.queryManifestByMid, {"manifest.mid": id}, function(res){
        var typeTxt = mtypeList[parseInt(res.manifest.type) -1];
        $('#mcode').text(res.manifest.code);
        $('#mtype').text(typeTxt); //– 类型
        $('#createDate').text(res.manifest.manifestTime);//– 货单时间
        $('#total').text(res.manifest.total);// – 总价
        $('#creator').text(res.manifest.createUser.currentName );// – 创建人
        //res.total;
    });
    //获取货单下商品
    var df2 = com.post(api.inventory.queryManifestItemByMid, {"manifest.mid": id}, function(res){

        if(res.manifestItems.length){
            $.each(res.manifestItems, function(i, v){
                var $tr = $('<tr></tr>')
                    .append('<td>' + v.goodsName + '</td>')
                    .append('<td>' + v.num + '</td>')
                    .append('<td>' + v.purchasePrice + '</td>');
                $tr.appendTo('#items');
            });
        }

    });

    $.when(df1, df2).done(function(){

        //var LODOP=getLodop(document.getElementById('LODOP_OB'),document.getElementById('LODOP_EM'));

        var LODOP = document.getElementById('LODOP_EM');

        if(LODOP){
            $('.print_container').css('display', 'block');

//        LODOP.SET_PRINT_PAGESIZE(1,58,200,'');

            CreateOneFormPage();
        }



    });

    //打印
    function CreateOneFormPage(){

        var LODOP = document.getElementById('LODOP_EM');
        var _div = document.getElementById('print-wrap');

        if(LODOP){
            LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_表单一");
            //LODOP.SET_PRINT_STYLE("FontSize",18);
            //LODOP.SET_PRINT_STYLE("Bold",1);
            //LODOP.ADD_PRINT_TEXT(50,231,260,39,"打印页面部分内容");
            //LODOP.ADD_PRINT_HTM(88,200,350,600,document.getElementById("print_container").innerHTML);


            LODOP.ADD_PRINT_HTM(0,0,"100%","100%", _div.innerHTML);
            //LODOP.ADD_PRINT_HTM(0,0,"100%","100%",document.documentElement.innerHTML);
            LODOP.SET_PRINT_PAGESIZE( 3,580, 20,'');


            /*LODOP.ADD_PRINT_RECT(0,0,_width,_height,0,1);

             LODOP.SET_PRINT_STYLE("FontSize",11);
             LODOP.ADD_PRINT_TEXT(20,10,100,25,"郭德强");
             LODOP.SET_PRINT_STYLEA(2,"FontName","隶书");
             LODOP.SET_PRINT_STYLEA(2,"FontSize",15);

             LODOP.ADD_PRINT_TEXT(53,187,75,20,"科学家");
             LODOP.ADD_PRINT_TEXT(100,131,272,20,"地址：中国北京社会科学院附近东大街西胡同");
             LODOP.ADD_PRINT_TEXT(138,132,166,20,"电话：010-88811888");*/

            LODOP.PRINT();
            //LODOP.PREVIEW();
        }
    };

});


