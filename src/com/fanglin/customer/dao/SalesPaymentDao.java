package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.utils.Paging;

public interface SalesPaymentDao extends Dao<SalesPaymentPO> {
	
	public List<SalesPaymentPO> queryCusSalesPayment(Paging paging,List<Filter> filters,String orderId);
	
}
