/**
 * Title: CustomerDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.utils.Paging;

public interface PaymentDao extends Dao<PaymentPO> {

	public List<PaymentPO> pagePaymentForHistory(Paging paging, List<Filter> filters, int company);
	
	public List<PaymentPO> queryPayment(List<Filter> filters);
	
	public List<PaymentPO> queryPaymentByOrderId(String orderId);
	
	public List<PaymentPO> queryPaymentByReceiptId(long arId);
	
}
