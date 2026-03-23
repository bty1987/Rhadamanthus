package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.OccessoriesItemPO;

public interface OccessoriesItemDao extends Dao<OccessoriesItemPO> {

	public List<OccessoriesItemPO> queryOccessoriesItemByOid(long oid);

	public int amountOccessoriesItem(String orderId, long nid);

}
