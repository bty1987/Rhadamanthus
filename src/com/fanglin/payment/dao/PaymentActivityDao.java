package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.PaymentActivityPO;
import com.fanglin.utils.Paging;

public interface PaymentActivityDao extends Dao<PaymentActivityPO> {

	public List<PaymentActivityPO> pagePaymentActivity(Paging paging, List<Filter> filters);

	public int amountPaymentActivity(String orderId, Short type);

}
