package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.utils.Paging;

public interface SalesBalanceService {

	public void pageSalesBalance(Paging paging, List<Filter> filter, SalesBalanceVO salesBalanceVO, int company) throws FLException;

	public void pageSalesBalanceForDompany(Paging paging, List<Filter> filter, SalesBalanceVO salesBalanceVO, int dompany) throws FLException;

	public void pageSalesBalanceForPompany(Paging paging, List<Filter> filter, SalesBalanceVO salesBalanceVO, int pompany) throws FLException;

	public void pageSalesBalanceForSupplier(Paging paging, List<Filter> filter, String userId, int pompany) throws FLException;

	public void pageSalesBalanceForCheck(Paging paging, List<Filter> filters, SalesBalanceVO salesBalanceVO, int pompany) throws FLException;

	public int updateSalesBalanceForVBalance(SalesBalanceVO salesBalanceVO) throws FLException;

	public int updateSalesBalanceForPBalance(SalesBalanceVO salesBalanceVO) throws FLException;

	public int rpreSalesBalance(SalesBalanceVO salesBalanceVO) throws FLException;

	public int passSalesBalance(List<Long> sid) throws FLException;

	// 不退定金销售结算 存在不退定金的销售单列表 , 根据销售单的结算类型和结算值完成结算数据的生成
	public int advSalesBalance(List<Long> sid, String userId) throws FLException;

	// 存在不退定金的销售单列表 , 根据销售单的结算类型和结算值完成反向不退定金结算数据的生成
	public int revSalesBalance(List<Long> sid, String userId) throws FLException;

	public int preSalesBalance(List<Long> sid, String userId) throws FLException;

	public int vpostSalesBalance(List<SalesBalanceVO> sbid, String userId) throws FLException;

	public int postSalesBalance(List<SalesBalanceVO> sbids, String userId) throws FLException;

	public int rejectSalesBalance(SalesBalanceVO salesBalanceVO, String userId) throws FLException;

	public int refundSalesBalance(SalesBalanceVO salesBalanceVO, String userId) throws FLException;

}
