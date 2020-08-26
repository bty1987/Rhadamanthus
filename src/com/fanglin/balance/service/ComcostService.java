package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.ComcostVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ComcostService {
   
	//分页
	public void pageComcost(Paging paging, List<Filter> filters, String userId);
	
	//添加
	public void addComcost(ComcostVO comcostVO, String userId, int company) throws FLException;
	
	//查询
	public List<ComcostVO> queryComcost(ComcostVO comcostVO);
	
	//更新
	public void updateComcostForStatus(ComcostVO comcostVO) throws FLException;
}
