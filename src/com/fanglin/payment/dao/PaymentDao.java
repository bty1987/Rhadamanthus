/**
 * Title: CustomerDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.payment.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.PaymentDO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.utils.Paging;

public interface PaymentDao extends Dao<PaymentPO> {

	public List<PaymentDO> pagePayment(Paging paging, List<Filter> filters) throws FLException;

	public List<PaymentPO> queryPayment(List<Filter> filters) throws FLException;

	public List<PaymentPO> queryPaymentByOrderId(String orderId);

	public int amountPayment(String orderId, Short type, Short paymentType, Short[] status);

	public int amountPayment(String orderId, Short paymentType, Timestamp collectTime);

	public PaymentDO queryPaymentByReceiptId(long arId);

}
