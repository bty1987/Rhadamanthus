package com.fanglin.market.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.vo.EpersonVO;
import com.fanglin.utils.Paging;

public interface EpersonService {

	public void pageEperson(Paging paging, List<Filter> filters);
	
	public EpersonVO queryEpersonByEuid(EpersonVO personVO);
	
	public List<EpersonVO> queryEpersonByPinYin(EpersonVO personVO);
	
	public void addEperson(EpersonVO personVO);
	
	public void updateEperson(EpersonVO personVO) throws FLException;
	
}
