package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.BrandPoolVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BrandPoolService {

	public void pageBrandPool(Paging paging, List<Filter> filters);

	public List<BrandPoolVO> queryBrandPoolByName(BrandPoolVO brandPoolVO);

	public int addBrandPool(BrandPoolVO brandPoolVO, int company) throws FLException;

	public int updateBrandPool(BrandPoolVO brandPoolVO) throws FLException;

	public int updateBrandPoolForStatus(BrandPoolVO brandPoolVO) throws FLException;
}
