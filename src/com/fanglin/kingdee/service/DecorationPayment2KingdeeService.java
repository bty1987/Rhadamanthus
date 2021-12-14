/**
 * @File Name		: DecorationPayment2KingdeeService.java
 * @Package   	: com.fanglin.kingdee.service
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service;

import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;

public interface DecorationPayment2KingdeeService {

	public void collect(DecorationReceiptPO decorationReceiptPO, DecorationPaymentPO decorationPaymentPO) throws Exception;
	
	public void refund(DecorationReceiptPO decorationReceiptPO, DecorationPaymentPO decorationPaymentPO) throws Exception;

	public void confirm(DecorationReceiptPO decorationReceiptPO, DecorationPaymentPO decorationPaymentPO) throws Exception;

}
