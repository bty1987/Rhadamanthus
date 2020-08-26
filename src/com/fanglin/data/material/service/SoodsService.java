package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.SoodsVO;
import com.fanglin.utils.Paging;

public interface SoodsService {

	public void pageSoods(Paging paging, List<Filter> filters, int company);
	
	public void pageSoodsByQiid(Paging paging, List<Filter> filters, SoodsVO soodsVO);
	
	public List<SoodsVO> querySoodsByQiid(SoodsVO soodsVO) throws FLException;
	
	public int addSoods(SoodsVO soodsVO, int company) throws FLException;
	
	public int updateSoods(SoodsVO soodsVO) throws FLException;
	
	public int deleteSoods(SoodsVO soodsVO) throws FLException;
	
}
