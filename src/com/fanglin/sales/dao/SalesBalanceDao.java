package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.utils.Paging;

public interface SalesBalanceDao extends Dao<SalesBalancePO> {

	public List<SalesBalancePO> pageSalesBalance(Paging paging, List<Filter> filter, Short type, int company) throws FLException;

	public List<SalesBalancePO> pageSalesBalanceForDompany(Paging paging, List<Filter> filter, Short type, int dompany) throws FLException;

	public List<SalesBalancePO> pageSalesBalanceForPompany(Paging paging, List<Filter> filter, Short type, int pompany) throws FLException;

	public List<SalesBalancePO> pageSalesBalanceForSupplier(Paging paging, List<Filter> filter, int pompany, int uid) throws FLException;

	public List<SalesBalancePO> pageSalesBalanceForCheck(Paging paging, List<Filter> filter, Short type, int pompany) throws FLException;

	public List<SalesBalancePO> querySalesBalance(long sid, short checkStatus);

	public List<SalesBalancePO> querySalesBalanceByOrderId(String orderId, List<Long> sids, short type, short onetype);

	public SalesBalancePO querySalesBalance(long sid, short type, short onetype);

	public SalesBalancePO querySalesBalance(long sid, long bid, short type, short onetype);

	public SalesBalancePO querySalesBalance(long sid, long bid, short type, short onetype, short deliverSchedule);

	public int countSalesBalance(long sid, short type, short onetype, short checkStatus) throws FLException;

	public int updateSalesBalance(long sid, short onetype, String field, short status);

}
