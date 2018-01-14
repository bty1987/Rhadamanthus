/**
 * @File Name		: PurchaseAmountService.java
 * @Package   	: com.fanglin.inventory.service
 * @Version		: 1.0
 * @Date			: 2016-10-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.inventory.vo.PurchaseAmountVO;

public interface PurchaseAmountService {
	
	public List<PurchaseAmountVO> queryPurchaseAmount();
	
	public int updatePurchaseAmount(String month, float money);

}
