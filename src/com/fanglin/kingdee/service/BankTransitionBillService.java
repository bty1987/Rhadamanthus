/**
 * @File Name		: BankTransitionBillService.java
 * @Package   	: com.fanglin.kingdee.service
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service;

import java.io.Serializable;
import java.util.List;

import com.fanglin.kingdee.ko.BankTransitionBillItemKO;

public interface BankTransitionBillService extends Serializable {

	public void save(String collectTime, String grade, String orderId, String paymentType, String brand, long realMoney, List<BankTransitionBillItemKO> item) throws Exception;

}
