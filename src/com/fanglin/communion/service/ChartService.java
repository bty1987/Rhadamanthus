package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.ChartVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

public interface ChartService {

	public void pageChart(Paging paging, List<Filter> filters);

	public List<ChartVO> queryChart(ChartVO chartVO);

	public List<ChartVO> queryChartForLogin(RoleVO roleVO);

	public List<ChartVO> queryChartByRid(RoleVO roleVO);

	public int updateRoleChartByRid(RoleVO roleVO, List<Long> cids, int rid) throws FLException;

}
