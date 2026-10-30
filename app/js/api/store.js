/**
 * app/js/api/store.js —— store 模块 API 定义（第 1 批，简单 CRUD 子集）
 *
 * 对齐旧 WebContent/js/api/store.js。本批迁移不含上传的纯 CRUD 页：
 *   mcategory(品类) mcolor(颜色) mformat(规格) address(收货地址) coupon(优惠券)
 * 含上传的页（mbrand/mprice/picture/slide）待上传组件移植后再迁。
 */
$.extend(api.index, {
    mcategoryIndex: { url: 'views/store/mcategory.html' },
    mcolorIndex:    { url: 'views/store/mcolor.html' },
    mformatIndex:   { url: 'views/store/mformat.html' },
    addressIndex:   { url: 'views/store/address.html' },
    couponIndex:    { url: 'views/store/coupon.html' },
    muserIndex:     { url: 'views/store/muser.html' }
});

$.extend(api, { store: {

    // ===== 品类 mcategory =====
    pageMcategory:        { url: 'pageMcategory.do', demo: true },
    queryMcategory:       { url: 'queryMcategory.do', demo: true },
    addMcategory:         { url: 'addMcategory.do' },
    updateMcategory:      { url: 'updateMcategory.do' },
    updateMcategoryForShow: { url: 'updateMcategoryForShow.do' }, // 切换首页显示状态

    // ===== 颜色 mcolor =====
    queryMcolorByGid:     { url: 'queryMcolorByGid.do', demo: true },
    queryMcolor:          { url: 'queryMcolor.do', demo: true },
    addMcolor:            { url: 'addMcolor.do' },
    updateMcolorForStatus:{ url: 'updateMcolorForStatus.do' }, // 启用/禁用

    // ===== 规格 mformat =====
    queryMformatByGid:    { url: 'queryMformatByGid.do', demo: true },
    queryMformat:         { url: 'queryMformat.do', demo: true },
    addMformat:           { url: 'addMformat.do' },
    updateMformatForStatus:{ url: 'updateMformatForStatus.do' },

    // ===== 收货地址 address =====
    pageAddress:          { url: 'pageAddress.do' },
    queryAddressByUid:    { url: 'queryAddressByUid.do' },
    queryAddress:         { url: 'queryAddress.do' },
    addAddress:           { url: 'addAddress.do' },
    updateAddress:        { url: 'updateAddress.do' },
    updateAddressForStatus:{ url: 'updateAddressForStatus.do' },

    // ===== 优惠券 coupon（value 为金额，需 tranargs ×1000/÷1000）=====
    pageCoupon: {
        url: 'pageCoupon.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['value'] }]
    },
    queryCouponByCid: {
        url: 'queryCouponByCid.do', type: 'query',
        tranargs: [{ result: 'coupon', args: ['value'] }]
    },
    addCoupon: {
        url: 'addCoupon.do', type: 'update',
        tranargs: { args: ['coupon.value'] }
    },
    updateCoupon: {
        url: 'updateCoupon.do', type: 'update',
        tranargs: { args: ['coupon.value'] }
    },
    updateCouponForStatus: { url: 'updateCouponForStatus.do' },

    // ===== 商城用户 muser =====
    pageMuser:          { url: 'pageMuser.do' },
    queryMuserByUnionId:{ url: 'queryMuserByUnionId.do' },
    saveMuser:          { url: 'saveMuser.do' },          // 新增
    updateMuser:        { url: 'updateMuser.do' },

    // ===== 品牌 mbrand（含图片上传）=====
    pageMbrand:           { url: 'pageMbrand.do', demo: true },
    queryMbrand:          { url: 'queryMbrand.do', demo: true },
    addMbrand:            { url: 'addMbrand.do' },
    updateMbrand:         { url: 'updateMbrand.do' },
    updateMbrandForStatus:{ url: 'updateMbrandForStatus.do' },

    // ===== 商品价格 mprice（含图片 + price 金额 tranargs）=====
    queryMpriceByGid:      { url: 'queryMpriceByGid.do', demo: true },
    addMprice:             { url: 'addMprice.do', type: 'update', tranargs: { args: ['mprice.price'] } },
    updateMpriceForStatus: { url: 'updateMpriceForStatus.do' },

    // ===== 商品图片 picture =====
    queryPictureByGid:     { url: 'queryPictureByGid.do', demo: true },
    addPicture:            { url: 'addPicture.do' },
    deletePicture:         { url: 'deletePicture.do' },
    updatePictureForSort:  { url: 'updatePictureForSort.do' },

    // ===== 轮播图 slide（含图片上传）=====
    querySlide:           { url: 'querySlide.do', demo: true },
    queryMgoodsByPinyin:  { url: 'queryMgoodsByPinyin.do', demo: true },
    addSlide:             { url: 'addSlide.do' },
    updateSlide:          { url: 'updateSlide.do' },
    updateSlideForStatus: { url: 'updateSlideForStatus.do' },

    // ===== 通用上传（图片/其他文件）=====
    uploadImg:            { url: 'uploadImg.do' },
    uploadOther:          { url: 'uploadOther.do' },

    // ===== 订单 morder + 订单明细 morderitem =====
    pageMorder:           { url: 'pageMorder.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['price'] }] },
    updateMorderForStatus:{ url: 'updateMorderForStatus.do' },
    deleteMorder:         { url: 'deleteMorder.do' },
    queryMorderItemByOid: { url: 'queryMorderItemByOid.do', type: 'query', tranargs: [{ result: 'morderItems', args: ['price'] }] },

    // ===== 材料展示用 =====
    queryMbrand:          { url: 'queryMbrand.do', demo: true },
    queryMpriceForShow:   { url: 'queryMpriceForShow.do' },

    // ===== 商品 mgoods（gid/name/no/price/barcode/defaultImg）=====
    pageMgoods:           { url: 'pageMgoods.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['price'] }] },
    queryMgoods:          { url: 'queryMgoods.do', type: 'query', tranargs: [{ result: 'mgoods', args: ['price'] }] },
    addMgoods:            { url: 'addMgoods.do', type: 'update', tranargs: { args: ['mgoods.price'] } },
    updateMgoods:         { url: 'updateMgoods.do', type: 'update', tranargs: { args: ['mgoods.price'] } },
    updateMgoodsForStatus:{ url: 'updateMgoodsForStatus.do' },
    queryMbrandByName:    { url: 'queryMbrandByName.do' }
}});
