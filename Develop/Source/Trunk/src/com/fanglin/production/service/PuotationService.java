package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.vo.PuotationItemVO;
import com.fanglin.production.vo.PuotationVO;

public interface PuotationService {
	
	public List<PuotationVO> queryPuotationByPid(PuotationVO puotationVO);

	public List<PuotationItemVO> queryPuotationItemByQid(PuotationVO puotationVO);
	
	public int addPuotation(PuotationVO puotationVO,String userId) throws FLException;
	
	public int addPuotationItem(PuotationItemVO puotationItemVO) throws FLException;
	
	public int updatePuotation(PuotationVO puotationVO) throws FLException;
	
	public int updatePuotationForAdvance(PuotationVO puotationVO) throws FLException;
	
	public int updatePuotationForDefault(PuotationVO puotationVO) throws FLException;
	
	public int deletePuotation(PuotationVO puotationVO) throws FLException;
	
	public int deletePuotationItem(PuotationItemVO puotationItemVO) throws FLException;

}
