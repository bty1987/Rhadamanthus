package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesRefundsItemPO;

public interface SalesRefundsItemDao extends Dao<SalesRefundsItemPO> {

	public List<SalesRefundsItemPO> querySalesRefundsItemBySid(long sid);

	public List<SalesRefundsItemPO> querySalesRefundsItemByRid(long rid);

}
