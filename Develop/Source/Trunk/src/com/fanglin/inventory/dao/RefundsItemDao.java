package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.RefundsItemPO;

public interface RefundsItemDao extends Dao<RefundsItemPO> {

	public List<RefundsItemPO> queryRefundsItemBySid(long sid);

}
