package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.OccessoriesItemVO;
import com.fanglin.inventory.vo.OccessoriesVO;
import com.fanglin.utils.Paging;

public interface OccessoriesService {

	public void pageOccessories(Paging paging, List<Filter> filters,int company);
	
	public void pageOccessoriesForSupplier(Paging paging, List<Filter> filters, String userId);
	
	public int addOccessories(OccessoriesVO occessoriesVO,List<OccessoriesItemVO> OccessoriesItemVOs, String userId) throws FLException;
	
	public int updateOccessoriesForStatus(OccessoriesVO occessoriesVO) throws FLException;
	
	public int bindOccessories(OccessoriesVO occessoriesVO) throws FLException;

	public int confirmOccessories(OccessoriesVO occessoriesVO, String userId) throws FLException;

	public int balanceOccessories(OccessoriesVO occessoriesVO, String userId) throws FLException;
	
	
}
