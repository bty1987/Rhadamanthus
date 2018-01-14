/**
 * @File Name		: StorehouseStockDao.java
 * @Package   	: com.fanglin.inventory.dao
 * @Version		: 1.0
 * @Date			: 2016-10-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.StorehouseStockPO;

public interface StorehouseStockDao extends Dao<StorehouseStockPO> {
	
	public List<StorehouseStockPO> queryStorehouseStock();
	
	public StorehouseStockPO queryStorehouseStockByShIdAMonth(long shId, String month);

}
