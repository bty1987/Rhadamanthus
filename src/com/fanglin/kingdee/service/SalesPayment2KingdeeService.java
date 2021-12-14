/**
 * @File Name		: SalesPayment2KingdeeService.java
 * @Package   	: com.fanglin.kingdee.service
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service;

import java.util.List;

import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.payment.po.SalesReceiptPO;

public interface SalesPayment2KingdeeService {

	public void collect(SalesReceiptPO salesReceiptPO, List<SalesPaymentPO> salesPaymentPOs) throws Exception;
	
	public void refund(SalesReceiptPO salesReceiptPO, SalesPaymentPO salesPaymentPO) throws Exception;

}
