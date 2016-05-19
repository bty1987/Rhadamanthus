var Orderdetail = (function(){

    var ordconf = {};

    var getUrlParams = function(){
        var url = location.search;

        var theRequest = new Object();
        url && (url = decodeURI(url));
        if (url.indexOf("?") != -1) {
            strs = url.substr(1).split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    };

    var binding = {
        btnOption : function(orderid){
            $('#projectbtn').click(function(){
                window.location.href = "btns.html?orderid=" + orderid;
            });
            $('#chargebtn').click(function(){
                window.location.href = "charge.html?orderid=" + orderid + "&authentication=" + ordconf.authentication;
            });


        }
    };

    return {
        init : function(){
            var searchParam = getUrlParams();
            ordconf = searchParam;
            $('#oederid').text(searchParam.orderId);
            $('#addr').text(searchParam.addr);
            $('#designer').text(searchParam.designer);
            $('#dphone').text(searchParam.designerPhone);
            $('#salesman').text(searchParam.salesman);
            $('#sphone').text(searchParam.salesmanPhone);

            searchParam.designerPhone != "---" && $('#dphone').attr('href',"tel:" + searchParam.designerPhone);
            searchParam.salesmanPhone != "---" && $('#sphone').attr('href',"tel:" + searchParam.salesmanPhone);

            binding.btnOption(searchParam.orderId);
        }
    };

})();


$(function () {
    Orderdetail.init();


});