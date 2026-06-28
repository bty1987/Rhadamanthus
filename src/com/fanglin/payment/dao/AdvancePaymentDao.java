/**
 * @File Name		: AdvancePaymentDao.java
 * @Package   	: com.fanglin.finance.dao
 * @Version		: 1.0
 * @Date			: 2015-9-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.utils.Paging;

public interface AdvancePaymentDao extends Dao<AdvancePaymentPO> {

	public List<AdvancePaymentPO> pageAdvancePayment(Paging paging, List<Filter> filters) throws FLException;

	public AdvancePaymentPO queryAdvancePaymentByOrderId(String orderId);

	/**
	 * 原子增加指定类型余额: UPDATE payment.advancepayment SET {field} = {field} + :delta WHERE apId = :apId
	 * paymentType 取值见 CustomerPO.BALANCE_TYPE_*_INT (0/1/2/3 分别对应 balance/projectBalance/materialBalance/zhenglinBalance)
	 */
	public int increaseBalanceByType(int apId, short paymentType, long delta);

	/**
	 * 原子扣减指定类型余额(含余额校验): UPDATE payment.advancepayment SET {field} = {field} - :delta WHERE apId = :apId AND {field} >= :delta
	 * 返回受影响行数, 0 表示余额不足
	 */
	public int decreaseBalanceByType(int apId, short paymentType, long delta);

}
