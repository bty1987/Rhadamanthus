package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.ApportDetailVO;
import com.fanglin.core.interceptor.FLException;

public interface ApportDetailService {

	public List<ApportDetailVO> queryApportDetailForBalance(ApportDetailVO apportDetailVO);
	
	public int addApportDetail(ApportDetailVO apportDetailVO,String userId) throws FLException;
}
