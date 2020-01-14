var api = {
    index: {},
    ds: {}
};

var Api = function(){

    var fillApi = function(url) {
        if (parent.window.isPC && parent.window.isEncryption) {
            url = url.substring(0, url.lastIndexOf('.')) + '.bin';
            require('nw.gui').Window.get().evalNWBin(null, url);
        } else {
            $.ajax({
                url: url,
                cache: false,
                type: 'get',
                dataType: 'script',
                async: false
            });
        }
    };

    return {
        init: function(path){

			console.log("path:" + path);

            var dtd = $.Deferred();

            fillApi(path + 'approval.js');
            fillApi(path + 'balance.js');
            fillApi(path + 'common.js');
            fillApi(path + 'construction.js');
            fillApi(path + 'data.js');
            fillApi(path + 'decoration.js');
            fillApi(path + 'dingding.js');
            fillApi(path + 'information.js');
            fillApi(path + 'inventory.js');
            fillApi(path + 'log.js');
            fillApi(path + 'material.js');
            fillApi(path + 'payment.js');
            fillApi(path + 'personel.js');
            fillApi(path + 'quotation.js');
            fillApi(path + 'report.js');
            fillApi(path + 'right.js');
            fillApi(path + 'salary.js');
            fillApi(path + 'system.js');
			fillApi(path + 'production.js');
            fillApi(path + 'ds.js');
            fillApi(path + 'building.js');
            fillApi(path + 'communion.js');
            fillApi(path + 'customer.js');
			fillApi(path + 'store.js');
			fillApi(path + 'market.js');
            fillApi(path + 'sales.js');
			
            return dtd.promise();
        }
    }
};
