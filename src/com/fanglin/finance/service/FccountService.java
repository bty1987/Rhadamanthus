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
import com.fanglin.finance.vo.FccountVO;
import com.fanglin.utils.Paging;

public interface FccountService {

	public void pageAccount(Paging paging, List<Filter> filters, String condition);

	public FccountVO queryAccountByAId(FccountVO accountVO) throws FLException;

	public FccountVO queryAccountForFormalByAId(FccountVO accountVO) throws FLException;

	public int addAccount(FccountVO accountVO) throws FLException;

	public int updateAccount(FccountVO accountVO) throws FLException;

	public int deleteAccount(FccountVO accountVO) throws FLException;

}
