package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.utils.Paging;


public interface DecorationPaymentDao extends Dao<DecorationPaymentPO> {

	public List<DecorationPaymentPO> queryCusDecorationPayment(Paging paging, List<Filter> filters,  String orderId);
	
}
