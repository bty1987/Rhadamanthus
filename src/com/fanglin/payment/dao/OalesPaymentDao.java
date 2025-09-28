package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.OalesPaymentPO;
import com.fanglin.utils.Paging;

public interface OalesPaymentDao extends Dao<OalesPaymentPO> {

	public List<OalesPaymentPO> pageOalesPayment(Paging paging, List<Filter> filters, Short type) throws FLException;

	public List<OalesPaymentPO> pageOalesPayment(Paging paging, List<Filter> filters) throws FLException;

	public List<OalesPaymentPO> queryOalesPaymentByOrderId(String orderId, List<Filter> filters) throws FLException;

	public List<OalesPaymentPO> queryOalesPaymentsByOid(long oid);

	public List<OalesPaymentPO> queryOalesPaymentByOids(List<Long> oids);

	public List<OalesPaymentPO> queryOalesPaymentForNotInitByOrid(long orid);

	public OalesPaymentPO queryOalesPayment(long osid);

}
