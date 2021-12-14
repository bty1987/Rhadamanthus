/**
 * @File Name		: ServiceKingdeeService.java
 * @Package   	: com.fanglin.kingdee.service
 * @Version		: 1.0
 * @Date			: 2021-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.payment.po.ServiceReceiptPO;

public interface ServiceKingdeeService {

	public void collect(ServicePaymentPO servicePaymentPO, ServiceReceiptPO serviceReceiptPO) throws FLException;

	public void refund(ServicePaymentPO servicePaymentPO, ServiceReceiptPO serviceReceiptPO) throws FLException;

}
