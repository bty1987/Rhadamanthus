package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.vo.SubFunctionActionVO;
import com.fanglin.utils.Paging;

public interface SubFunctionActionService {
	
	public void pageSubFunctionAction(Paging paging, List<FilterVO> filters);
	
	public SubFunctionActionVO querySubFunctionActionByName(SubFunctionActionVO subFunctionAction);

	public int addSubFunctionAction(SubFunctionActionVO subFunctionAction) throws FLException;
	
	public int updateSubFunctionAction(SubFunctionActionVO subFunctionAction) throws FLException;
	
	public void deleteSubFunctionAction(int actionId);
	
	public String deleteSubFunctionActions(List<Integer> actionIds);
	
}
