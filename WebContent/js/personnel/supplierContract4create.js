jQuery(function($) {

    var userContractcreate = {

        items: {
            contract: com.focusPage("#contract")
        },

        btns: {
            preservation: com.focusPage("#preservation")
        },

        htmls: {
            contractPopUp: com.focusPage("#contractPopUp")
        },

        no: null,
        name: null,
        title: null,
        contracts: {},
        cid: null,
        html: null,
        scid: null,
        contractArgs: params.personel.contractargs,
    };

    userContractcreate.cid = params.personel.contractargs.cid;
    userContractcreate.no = params.personel.contractargs.no;
    userContractcreate.name = params.personel.contractargs.name;
    userContractcreate.title = params.personel.contractargs.title;
    userContractcreate.html = params.personel.contractargs.html;
    userContractcreate.scid = params.personel.contractargs.scid;

    params.personel.contractargs = com.splitUrl(userContractcreate.html);
    params.personel.contractargs.cid = userContractcreate.cid;
    params.personel.contractargs.no = userContractcreate.no;
    params.personel.contractargs.name = userContractcreate.name;
    params.personel.contractargs.title = userContractcreate.title;
    params.personel.contractargs.scid = userContractcreate.scid;

    userContractcreate.htmls.contractPopUp.load(userContractcreate.html);

});