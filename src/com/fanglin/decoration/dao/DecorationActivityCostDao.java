package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationActivityCostPO;

public interface DecorationActivityCostDao extends Dao<DecorationActivityCostPO> {

	public List<DecorationActivityCostPO> queryDecorationActivityCostByOrderId(String orderId);
}
