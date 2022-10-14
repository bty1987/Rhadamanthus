package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.SoodsVO;
import com.fanglin.utils.Paging;

public interface SoodsService {

	public void pageSoods(Paging paging, List<Filter> filters, SoodsVO soodsVO, int company);

	public List<SoodsVO> querySoodsByName(SoodsVO soodsVO, int company);

	public SoodsVO querySoods(SoodsVO soodsVO);

	public int addSoods(SoodsVO soodsVO, int company) throws FLException;

	public int updateSoods(SoodsVO soodsVO) throws FLException;

	public int updateSoodsForStatus(List<SoodsVO> soodes) throws FLException;

	public int copySoods(SoodsVO soodsVO) throws FLException;

	public int deleteSoods(SoodsVO soodsVO) throws FLException;

}
