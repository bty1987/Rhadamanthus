package com.fanglin.customer.service;


import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.VscoreRecordVO;
import com.fanglin.customer.vo.VscoreVO;
import com.fanglin.utils.Paging;

public interface VscoreService {

	public VscoreVO queryVscoreByUnionId(VscoreVO vscoreVO);
	
	public void pageVscoreRecordByUnionId(Paging paging, List<Filter> filters, String unionId);
	
	public void raiseVscore(VscoreVO vscoreVO, String userId);
	
	public void pickupVscore(VscoreVO vscoreVO, String userId) throws FLException;
	
	public void updateVscoreRecordForStatus(VscoreRecordVO vscoreRecordVO);
	
}
