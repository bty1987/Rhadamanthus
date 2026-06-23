package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationBalanceVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.utils.Paging;

public interface DecorationBalanceService {

	public void pageDecorationForBalance(Paging paging, List<Filter> filters, int company) throws FLException;

	public DecorationBalanceVO queryDecorationBalance(DecorationVO decorationVO);

	public int makeDecorationBalance(DecorationBalanceVO decorationBalanceVO, String userId) throws FLException;

}
