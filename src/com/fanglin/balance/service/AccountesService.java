package com.fanglin.balance.service;

import java.util.List;


import com.fanglin.balance.vo.AccountVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface AccountesService {
	
	public void pageAccount(Paging paging, List<Filter> filters, String userId);
	
	public List<AccountVO> queryAccount(AccountVO accountesVO);
	
	public void addAccount(AccountVO accountesVO, String userId) throws FLException;
	
	public void updateAccountForStatus(AccountVO accountesVO) throws FLException;
}
