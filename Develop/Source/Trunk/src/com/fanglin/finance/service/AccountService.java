/**
 * @File Name		: AccountService.java
 * @Package   	: com.fanglin.finance.service
 * @Version		: 1.0
 * @Date			: 2015-12-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.vo.AccountVO;
import com.fanglin.utils.Paging;

public interface AccountService {
	
	public void pageAccount(Paging paging, List<Filter> filters, String condition);
	
	public AccountVO queryAccountByAId(AccountVO accountVO) throws FLException;
	
	public AccountVO queryAccountForFormalByAId(AccountVO accountVO) throws FLException;
	
	public int addAccount(AccountVO accountVO) throws FLException;
	
	public int updateAccount(AccountVO accountVO) throws FLException;
	
	public int deleteAccount(AccountVO accountVO) throws FLException;

}
