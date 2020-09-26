jQuery(function($) {

    var addDecorationContract = {
        items: {
            contract: com.focusPage("#contract")
        },
        btns: {
            preservation: com.focusPage("#preservation")
        },
        htmls:{
        	contractPopUp: com.focusPage("#contractPopUp")
        },
       decorationOrderId : params.decorationOrderId
    };

    com.post(api.communion.queryContract, {}, function (res) {
        addDecorationContract.items.contract.bindData(res.contracts, "cid", "name", true);
    });

     addDecorationContract.items.contract.on('click', function () {

          params.cidNumber = addDecorationContract.items.contract.val();
          params.decorationData = addDecorationContract.decorationOrderId;
          
          var url;

         switch (params.cidNumber) {
		  case '1':
			  url = "views/contract/decorationContractTemp3.html";
			break;
		  case '2':
			  url = "views/contract/decorationContractTemp3.html";
			break;
		  case '3':
			  url = "views/contract/decorationContractTemp3.html";
			break;
		  case '4':
			  url = "views/contract/decorationContractTemp1.html";
			break;
		  case '5':
			  url = "views/contract/decorationContractTemp2.html";
			break;
		}

        addDecorationContract.htmls.contractPopUp.load(url);
     });
});