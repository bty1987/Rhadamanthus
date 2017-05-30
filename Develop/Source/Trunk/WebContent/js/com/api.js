var api = {
    index: {},
    ds: {}
}

var Api = function(){
    
    var fillApi = function(url){
        $.ajax({
                url: url,
                cache: false,
                type: 'get',
                dataType: 'script',
                async: false
            });
    }
    
    return {
        init: function(path){
            
            var dtd = $.Deferred();
          
            fillApi(path + 'addReduce.js');
            fillApi(path + 'approval.js');
            fillApi(path + 'common.js');
            fillApi(path + 'construction.js');
            fillApi(path + 'data.js');
            fillApi(path + 'decoration.js');
            fillApi(path + 'department.js');
            fillApi(path + 'dingding.js');
            fillApi(path + 'drawline.js');
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
            
            return dtd.promise();
        }
    }
    
}
