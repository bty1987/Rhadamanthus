package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.utils.Paging;

public interface PaymentDao extends Dao<PaymentPO> {

	public List<PaymentPO> queryCusPayment(Paging paging, List<Filter> filters, String orderId);

}
