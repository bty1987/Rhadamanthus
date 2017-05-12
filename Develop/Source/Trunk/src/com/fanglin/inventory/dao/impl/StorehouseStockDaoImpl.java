/**
 * @File Name		: StorehouseStockDao.java
 * @Package   	: com.fanglin.inventory.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-10-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.po.StorehouseStockPO;

@Repository("storehouseStockDao")
public class StorehouseStockDaoImpl extends DaoImpl<StorehouseStockPO> implements com.fanglin.inventory.dao.StorehouseStockDao {

	public StorehouseStockDaoImpl(){
		super(StorehouseStockPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<StorehouseStockPO> queryStorehouseStock() {
		return session().createCriteria(StorehouseStockPO.class).list();
	}

	@Override
	public StorehouseStockPO queryStorehouseStockByShIdAMonth(long shId, String month) {
		return (StorehouseStockPO) session().createCriteria(StorehouseStockPO.class).createAlias("storehouse", "storehouse").add(Restrictions.eq(StorehouseStockPO.COLUMN_SHID_STR, shId)).add(Restrictions.eq(StorehouseStockPO.COLUMN_MONTH_STR, month)).uniqueResult();
	}
	
}
