package com.fanglin.market.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.vo.EcaseVO;
import com.fanglin.utils.Paging;

public interface EcaseService {

	public void pageEcase(Paging paging, List<Filter> filters);
	
	public List<EcaseVO> queryEcaseByTypeAndStatus(EcaseVO caseVO);
	
	public void addEcase(EcaseVO caseVO) throws FLException;
	
	public void updateEcase(EcaseVO caseVO) throws FLException;
	
	public void updateEcaseForStatus(EcaseVO caseVO) throws FLException;
	
	public void deleteEcase(EcaseVO caseVO) throws FLException;
	
	public EcaseVO queryEcaseByCid(EcaseVO caseVO);
}
