package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.CouponVO;
import com.fanglin.utils.Paging;

public interface CouponService {

	public void pageCoupon(Paging paging, List<Filter> filters);

	public CouponVO queryCouponByCid(CouponVO couponVO);

	public int addCoupon(CouponVO couponVO) throws FLException;

	public int updateCoupon(CouponVO couponVO);

	public int updateCouponForStatus(CouponVO couponVO);

}
