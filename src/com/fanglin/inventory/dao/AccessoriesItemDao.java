package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.AccessoriesItemPO;

public interface AccessoriesItemDao extends Dao<AccessoriesItemPO> {

	public List<?> queryAccessoriesItem(String orderId);

	public List<AccessoriesItemPO> queryAccessoriesItem(long aid);

	public List<AccessoriesItemPO> queryAccessoriesItem(List<Long> aids);

	public int amountAccessoriesItem(String orderId, long nid);

}
