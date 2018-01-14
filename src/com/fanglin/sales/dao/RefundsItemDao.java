package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.RefundsItemPO;

public interface RefundsItemDao extends Dao<RefundsItemPO> {

	public List<RefundsItemPO> queryRefundsItemBySid(long sid);

}
