package com.fanglin.decoration.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationInfoPO;

public interface DecorationInfoDao extends Dao<DecorationInfoPO> {
	
	public DecorationInfoPO queryDecorationInfoByOrderId(String orderId);

}
