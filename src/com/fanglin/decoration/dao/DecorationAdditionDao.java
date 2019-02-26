package com.fanglin.decoration.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationAdditionPO;

public interface DecorationAdditionDao extends Dao<DecorationAdditionPO> {

	public DecorationAdditionPO queryDecorationAdditionByOrderId(String orderId);

}
