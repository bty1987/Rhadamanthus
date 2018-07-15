$.extend(api.index, {
	morders: {url: "/views/store/morderitem.html"},
	mordersitem: {url: "/views/store/morder.html"},
});

$.extend(api, {store: {
	queryAddressByUid: {url: "queryAddressByUid.do", server: "store"},
	queryAddress: {url: "queryAddress.do", server: "store"},
	addAddress: {url: "addAddress.do", server: "store"},
	updateAddress: {url: "updateAddress.do", server: "store"},
	updateAddressByAid: {url: "updateAddressByAid.do", server: "store"},
	updateAddressForStatus: {url: "updateAddressForStatus.do", server: "store"},
	
	pageCart: {url: "pageCart.do", server: "store"},
	queryCartByUnionId: {url: "queryCartByUnionId.do", server: "store"},
	addCart: {url: "addCart.do", server: "store"},
	updateCart: {url: "updateCart.do", server: "store"},
	clearCart: {url: "clearCart.do", server: "store"},
	
	pageMbrand: {url: "pageMbrand.do", server: "store"},
	queryMbrand: {url: "queryMbrand.do", server: "store"},
	queryMbrandByName: {url: "queryMbrandByName.do", server: "store"},
	addMbrand: {url: "addMbrand.do", server: "store"},
	updateMbrand: {url: "updateMbrand.do", server: "store"},
	updateMbrandForStatus: {url: "updateMbrandForStatus.do", server: "store"},
	
	pageMcategory: {url: "pageMcategory.do", server: "store"},
	queryMcategory: {url: "queryMcategory.do", server: "store"},
	queryMcategoryForShow: {url: "queryMcategoryForShow.do", server: "store"},
	addMcategory: {url: "addMcategory.do", server: "store"},
	updateMcategory: {url: "updateMcategory.do", server: "store"},
	updateMcategoryForShow: {url: "updateMcategoryForShow.do", server: "store"},
	
	queryMcolorByGid: {url: "queryMcolorByGid.do", server: "store"},
	queryMcolor: {url: "queryMcolor.do", server: "store"},
	addMcolor: {url: "addMcolor.do", server: "store"},
	updateMcolorForStatus: {url: "updateMcolorForStatus.do", server: "store"},
	
	queryMformatByGid: {url: "queryMformatByGid.do", server: "store"},
	queryMformat: {url: "queryMformat.do", server: "store"},
	addMformat: {url: "addMformat.do", server: "store"},
	updateMformatForStatus: {url: "updateMformatForStatus.do", server: "store"},
	
	
	pageMgoods: {url: "pageMgoods.do", server: "store"},
	queryMgoods: {url: "queryMgoods.do", server: "store"},
	queryMgoodsByPinyin: {url: "queryMgoodsByPinyin.do", server: "store"},
	addMgoods: {url: "addMgoods.do", server: "store"},
	updateMgoods: {url: "updateMgoods.do", server: "store"},
	updateMgoodsForDefaultImg: {url: "updateMgoodsForDefaultImg.do", server: "store"},
	updateMgoodsForStatus: {url: "updateMgoodsForStatus.do", server: "store"},
	
	pageMorder: {url: "pageMorder.do", server: "store"},
	queryMorderByUnionId: {url: "queryMorderByUnionId.do", server: "store"},
	addMorder: {url: "addMorder.do", server: "store"},
	updateMorderForStatus: {url: "updateMorderForStatus.do", server: "store"},
	deleteMorder: {url: "deleteMorder.do", server: "store"},
	
	queryMorderItemByOid: {url: "queryMorderItemByOid.do", server: "store"},

	queryMprice: {url: "queryMprice.do", server: "store"},
	queryMpriceByGid: {url: "queryMpriceByGid.do", server: "store"},
	queryMpriceByBid: { url: "queryMpriceByBid.do", server: "store"},
	queryMpriceByPinyin: {url: "queryMpriceByPinyin.do", server: "store"},
	queryMpriceForShow: {url: "queryMpriceForShow.do", server: "store"},
	addMprice: {url: "addMprice.do", server: "store"},
	updateMpriceForStatus: {url: "updateMpriceForStatus.do", server: "store"},
	
	pageMuser: {url: "pageMuser.do", server: "store"},
	queryMuserByUnionId: {url: "queryMuserByUnionId.do", server: "store"},
	saveMuser: {url: "saveMuser.do", server: "store"},
	updateMuser: {url: "updateMuser.do", server: "store"},
	
	queryPictureByGid: {url: "queryPictureByGid.do", server: "store"},
	queryPicture: {url: "queryPicture.do", server: "store"},
	addPicture: {url: "addPicture.do", server: "store"},
	updatePictureForSort: {url: "updatePictureForSort.do", server: "store"},
	deletePicture: {url: "deletePicture.do", server: "store"},
	
	querySlide: {url: "querySlide.do", server: "store"},
	querySlideForShow: {url: "querySlideForShow.do", server: "store"},
	addSlide: {url: "addSlide.do", server: "store"},
	updateSlide: {url: "updateSlide.do", server: "store"},
	updateSlideForStatus: {url: "updateSlideForStatus.do", server: "store"},
	
	pageEvaluate: {url: "pageEvaluate.do", server: "store"},
	addEvaluate: {url: "addEvaluate.do", server: "store"},
	
	addMpayment: {url: "addMpayment.do", server: "store"}

}});