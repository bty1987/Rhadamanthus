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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.PaymentPO;

public interface AdvanceKingdeeService {

	public void collect(AdvanceReceiptPO advanceReceiptPO, PaymentPO paymentPO, DecorationPO decorationPO) throws FLException;

	public void refund(AdvanceReceiptPO advanceReceiptPO, PaymentPO paymentPO, DecorationPO decorationPO) throws FLException;

}
