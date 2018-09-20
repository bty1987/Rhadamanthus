package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.MuserCouponVO;
import com.fanglin.utils.Paging;

public interface MuserCouponService {
	
	public void pageMuserCoupon (Paging paging, List<Filter> filters);
	
	public List<MuserCouponVO> queryMuserCouponByUnionId (MuserCouponVO muserCouponVO);
	
	public void addMuserCoupon (MuserCouponVO muserCouponVO) throws FLException;

}
