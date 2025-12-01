package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.utils.Paging;

public interface SalesPaymentDao extends Dao<SalesPaymentPO> {

	public List<SalesPaymentPO> pageSalesPayment(Paging paging, List<Filter> filters, Short type) throws FLException;

	public List<SalesPaymentPO> pageSalesPayment(Paging paging, List<Filter> filters) throws FLException;

	public List<SalesPaymentPO> querySalesPaymentByOrderId(String orderId, List<Filter> filters) throws FLException;

	public List<SalesPaymentPO> querySalesPaymentsBySid(long sid);

	public List<SalesPaymentPO> querySalesPaymentBySids(List<Long> sids);

	public List<SalesPaymentPO> querySalesPaymentBySids(List<Long> sids, List<Short> status);

	public List<SalesPaymentPO> querySalesPaymentForNotInitBySrid(long srid);

	public SalesPaymentPO querySalesPayment(long sid, List<Short> types);

	public int countSalesPayment(long sid, List<Short> types);

	public long amountSalesPayment(String orderId);

}
