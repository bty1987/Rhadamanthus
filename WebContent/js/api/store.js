$.extend(api.index, {
	morders: {url: "/views/store/morderitem.html"},
	mordersitem: {url: "/views/store/morder.html"}
});

$.extend(api, {store: {
	queryAddressByUid: {url: "queryAddressByUid.do"},
	queryAddress: {url: "queryAddress.do"},
	addAddress: {url: "addAddress.do"},
	updateAddress: {url: "updateAddress.do"},
	updateAddressByAid: {url: "updateAddressByAid.do"},
	updateAddressForStatus: {url: "updateAddressForStatus.do"},
	
	pageCart: {url: "pageCart.do"},
	queryCartByUnionId: {url: "queryCartByUnionId.do"},
	addCart: {url: "addCart.do"},
	updateCart: {url: "updateCart.do"},
	clearCart: {url: "clearCart.do"},
	
	pageMbrand: {url: "pageMbrand.do"},
	queryMbrand: {url: "queryMbrand.do"},
	queryMbrandByName: {url: "queryMbrandByName.do"},
	addMbrand: {url: "addMbrand.do"},
	updateMbrand: {url: "updateMbrand.do"},
	updateMbrandForStatus: {url: "updateMbrandForStatus.do"},
	
	pageMcategory: {url: "pageMcategory.do"},
	queryMcategory: {url: "queryMcategory.do"},
	queryMcategoryForShow: {url: "queryMcategoryForShow.do"},
	addMcategory: {url: "addMcategory.do"},
	updateMcategory: {url: "updateMcategory.do"},
	updateMcategoryForShow: {url: "updateMcategoryForShow.do"},
	
	queryMcolorByGid: {url: "queryMcolorByGid.do"},
	queryMcolor: {url: "queryMcolor.do"},
	addMcolor: {url: "addMcolor.do"},
	updateMcolorForStatus: {url: "updateMcolorForStatus.do"},
	
	queryMformatByGid: {url: "queryMformatByGid.do"},
	queryMformat: {url: "queryMformat.do"},
	addMformat: {url: "addMformat.do"},
	updateMformatForStatus: {url: "updateMformatForStatus.do"},
	
	pageMgoods: {
	    url: "pageMgoods.do",
	    type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["price"]
        }]
	},
	queryMgoods: {
	    url: "queryMgoods.do",
	    type: "query",
        tranargs: [{
            result: "mgoods",
            args: ["price"]
        }]
	},
	queryMgoodsByPinyin: {url: "queryMgoodsByPinyin.do"},
	addMgoods: {
	    url: "addMgoods.do",
	    type: "update",
        tranargs: {
            args: ["mgoods.price"]
        }
	},
	updateMgoods: {
	    url: "updateMgoods.do",
	    type: "update",
        tranargs: {
            args: ["mgoods.price"]
        }
	},
	updateMgoodsForDefaultImg: {url: "updateMgoodsForDefaultImg.do"},
	updateMgoodsForStatus: {url: "updateMgoodsForStatus.do"},

	pageMorder: {
	    url: "pageMorder.do",
	    type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["total"]
        }]
	},
	queryMorderByUnionId: {
	    url: "queryMorderByUnionId.do",
	    type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["total"]
        }]
	},
	addMorder: {
	    url: "addMorder.do",
	    type: "update",
        tranargs: {
            args: ["morder.total"]
        }
	},
	updateMorderForStatus: {url: "updateMorderForStatus.do"},
	deleteMorder: {url: "deleteMorder.do"},

	queryMorderItemByOid: {url: "queryMorderItemByOid.do"},

	queryMprice: {
	    url: "queryMprice.do",
	    type: "query",
        tranargs: [{
            result: "prices",
            args: ["price"]
        }]
	},
	queryMpriceByGid: {
	    url: "queryMpriceByGid.do",
	    type: "query",
        tranargs: [{
            result: "prices",
            args: ["price"]
        }]
	},
	queryMpriceByBid: {
	    url: "queryMpriceByBid.do",
	    type: "query",
        tranargs: [{
            result: "prices",
            args: ["price"]
        }]
	},
	queryMpriceByPinyin: {
	    url: "queryMpriceByPinyin.do",
	    type: "query",
        tranargs: [{
            result: "prices",
            args: ["price"]
        }]
	},
	queryMpriceForShow: {
	    url: "queryMpriceForShow.do",
	    type: "query",
        tranargs: [{
            result: "prices",
            args: ["price"]
        }]
	},
	addMprice: {
	    url: "addMprice.do",
	    type: "update",
        tranargs: {
            args: ["mprice.price"]
        }
	},
	updateMpriceForStatus: {url: "updateMpriceForStatus.do"},

	pageMuser: {url: "pageMuser.do"},
	queryMuserByUnionId: {url: "queryMuserByUnionId.do"},
	saveMuser: {url: "saveMuser.do"},
	updateMuser: {url: "updateMuser.do"},

	queryPictureByGid: {url: "queryPictureByGid.do"},
	queryPicture: {url: "queryPicture.do"},
	addPicture: {url: "addPicture.do"},
	updatePictureForSort: {url: "updatePictureForSort.do"},
	deletePicture: {url: "deletePicture.do"},

	querySlide: {url: "querySlide.do"},
	querySlideForShow: {url: "querySlideForShow.do"},
	addSlide: {url: "addSlide.do"},
	updateSlide: {url: "updateSlide.do"},
	updateSlideForStatus: {url: "updateSlideForStatus.do"},

	addMpayment: {
	    url: "addMpayment.do",
	    type: "update",
        tranargs: {
            args: ["mpayment.totalPrice"]
        }
	},

	pageEvaluate: {url: "pageEvaluate.do"},
	addEvaluate: {url: "addEvaluate.do"},

	pageCoupon: {
	    url: "pageCoupon.do",
	    type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["value"]
        }]
	},
	queryCouponByCid: {
	    url: "queryCouponByCid.do",
	    type: "query",
        tranargs: [{
            result: "coupons",
            args: ["value"]
        }]
	},
	addCoupon: {
	    url: "addCoupon.do",
	    type: "update",
        tranargs: {
            args: ["coupon.value"]
        }
	},
	updateCoupon: {
	    url: "updateCoupon.do",
	    type: "update",
        tranargs: {
            args: ["coupon.value"]
        }
	},
	updateCouponForStatus: {url: "updateCouponForStatus.do"},
	
	pageMuserCoupon: {url: "pageMuserCoupon.do"},
	queryMuserCouponByUnionId: {url: "queryMuserCouponByUnionId.do"},
	addMuserCoupon: {url: "addMuserCoupon.do"}
}});