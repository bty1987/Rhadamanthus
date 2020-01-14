package com.fanglin.balance.service;

import java.util.List;


import com.fanglin.balance.vo.AccountVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface AccountService {
	
	public void pageAccount(Paging paging, List<Filter> filters, String userId);
	
	public List<AccountVO> queryAccount(AccountVO accountVO);
	
	public void addAccount(AccountVO accountVO, String userId, int company) throws FLException;
	
	public void updateAccountForStatus(AccountVO accountVO) throws FLException;
	
	public List<AccountVO> queryAccountForTeller(int company);
	
	public void withdrawAccount(AccountVO accountVO, String userId, int company) throws FLException ;
}
