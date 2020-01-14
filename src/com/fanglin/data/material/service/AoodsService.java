package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.AoodsVO;
import com.fanglin.utils.Paging;

public interface AoodsService {
	
	public void pageAoods(Paging paging, List<Filter> filters,int company);
	
	public List<AoodsVO> queryAoodsByName(AoodsVO aoodsVO, String orderId);
	
	public List<AoodsVO> queryAoodsByAtid(AoodsVO aoodsVO, String orderId);
	
	public int addAoods(AoodsVO aoodsVO, int company) throws FLException;
	
	public int updateAoods(AoodsVO aoodsVO) throws FLException;
	
	public int updateAoodsForStatus(AoodsVO aoodsVO) throws FLException;

}
