/**
 * Title: CustomerDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.utils.Paging;

public interface PaymentDao extends Dao<PaymentPO> {

	public List<PaymentPO> pagePaymentForHistory(Paging paging, List<FilterVO> filters);
	
	public List<PaymentPO> queryPayment(List<FilterVO> filters);
	
	public List<PaymentPO> queryPaymentByOrderId(String orderId);
	
	public List<PaymentPO> queryPaymentByReceiptId(long arId);
	
}
