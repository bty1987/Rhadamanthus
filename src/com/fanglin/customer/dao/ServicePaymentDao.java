package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.utils.Paging;

public interface ServicePaymentDao extends Dao<ServicePaymentPO> {

	public List<ServicePaymentPO> queryCusServicePayment(Paging paging, List<Filter> filters, String orderId);

	public long countCusServicePaymentForAmount(String orderId);

}
