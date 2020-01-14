package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.TranpackVO;
import com.fanglin.utils.Paging;

public interface TranpackService {

	public void pageTranpack(Paging paging, List<Filter> filters);

	public List<TranpackVO> queryTranpackByPid(TranpackVO tranpackVO);

	public void packTranpackForOutsource(TranpackVO tranpack, String userId)throws FLException;

	public void packTranpackForHardware(TranpackVO tranpack, String queryUserId)throws FLException;

	public void packTranpackForPlan(TranpackVO tranpack, String queryUserId)throws FLException;

	public int instoreTranpack(TranpackVO tranpack)throws FLException;
	
	public int planTranPack(TranpackVO tranpack)throws FLException;

	public int tranTranpack(TranpackVO tranpack,String userId)throws FLException;

	public int mountTranpack(TranpackVO tranpack,String userId)throws FLException;
	
	public int completeTranpack(TranpackVO tranpack)throws FLException;

	public int lossTranpack(TranpackVO tranpack)throws FLException;

}
