package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.NoodsVO;
import com.fanglin.utils.Paging;

public interface NoodsService {

	public void pageNoods(Paging paging, List<Filter> filters, int company) throws FLException;

	public NoodsVO queryNoods(NoodsVO noodsVO) throws FLException;

	public List<NoodsVO> queryNoodsByName(NoodsVO noodsVO, int company);

	public int addNoods(NoodsVO noodsVO, int company) throws FLException;

	public int updateNoods(NoodsVO noodsVO) throws FLException;

	public int updateNoodsForStatus(NoodsVO noodsVO) throws FLException;

	public int updateNoodsForCalc(NoodsVO noodsVO) throws FLException;

}
