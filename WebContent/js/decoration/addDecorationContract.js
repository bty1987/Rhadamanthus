jQuery(function($) {

    var addDecorationContract = {
        items: {
            contract: com.focusPage("#contract")
        },
        btns: {
            preservation: com.focusPage("#preservation")
        },
        htmls:{
        	editContractPopUp: com.focusPage("#editContractPopUp")
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
			  url = "views/decoration/decorationContract2edit.html";
			break;
		  case '2':
			  url = "views/decoration/decorationContract2edit.html";
			break;
		  case '3':
			  url = "views/decoration/decorationContract2edit.html";
			break;
		  case '4':
			  url = "views/decoration/decorationContract0edit.html";
			break;
		  case '5':
			  url = "views/decoration/decorationContract1edit.html";
			break;
		}

        addDecorationContract.htmls.editContractPopUp.load(url);
     });
});