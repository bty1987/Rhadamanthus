/**
 * @File Name		: PurchaseAmountDao.java
 * @Package   	: com.fanglin.inventory.dao
 * @Version		: 1.0
 * @Date			: 2016-10-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.PurchaseAmountPO;

public interface PurchaseAmountDao extends Dao<PurchaseAmountPO> {
	
	public List<PurchaseAmountPO> queryPurchaseAmount();
	
	public PurchaseAmountPO queryPurchaseAmountByMonth(String month);

}
