package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserRequireVO;
import com.fanglin.utils.Paging;

public interface UserRequireService {
	
	public void pageUserRequire(Paging paging, List<Filter> filters);
	
	public void addUserRequire(UserRequireVO userRequire,String userId);
	
	public void approveUserRequire(UserRequireVO userRequireVO) throws FLException;
	
	public void refuseUserRequire(UserRequireVO userRequireVO) throws FLException;
	
	public void finishUserRequire(UserRequireVO userRequireVO) throws FLException;
	
}
