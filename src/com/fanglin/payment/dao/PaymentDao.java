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

	/**
	 * 对账核算基线: 按订单+款项类型, 对状态为已收款/已确认的流水做带方向的 SUM, 得到该桶"应有余额"。
	 * 收款(type=1)/退回(type=3)为正, 提现(type=0)/付款(type=2)为负, 仅计入 status IN(1,2)。
	 * 返回 long 避免现有 int 版在大额订单(>214万元)时溢出丢精度。
	 */
	public long balancePayment(String orderId, Short paymentType);

	public PaymentDO queryPaymentByReceiptId(long arId);

	public int updatePaymentForAid(String orderId, short paymentType, long aid);

}
