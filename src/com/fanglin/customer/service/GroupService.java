package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.GroupVO;
import com.fanglin.utils.Paging;

public interface GroupService {
	
	public void pageGroup(Paging paging ,List<Filter> filters);
	
	public GroupVO queryGroup(GroupVO groupVO);
	
	public int updateGroup(GroupVO groupVO) throws FLException;
	
	public int updateGroupForCommon(GroupVO groupVO) throws FLException;
	
	public int bindGroup(GroupVO groupVO) throws FLException;
	
	public int unbindGroup(GroupVO groupVO) throws FLException;

}
