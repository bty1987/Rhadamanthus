package com.fanglin.decoration.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationAccountStatusPO;

public interface DecorationAccountStatusDao extends Dao<DecorationAccountStatusPO> {

	public DecorationAccountStatusPO queryDecorationAccountStatusByOrderId(String orderId);

}
