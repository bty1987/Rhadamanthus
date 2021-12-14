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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.payment.po.SalesReceiptPO;
import com.fanglin.sales.po.SalesPO;

public interface SalesKingdeeService {

	public void collect(SalesPO salesPO, SalesReceiptPO salesReceiptPO, List<SalesPaymentPO> salesPaymentPOs) throws FLException;

	public void refund(SalesPO salesPO, SalesReceiptPO salesReceiptPO, SalesPaymentPO salesPaymentPO) throws FLException;

}
