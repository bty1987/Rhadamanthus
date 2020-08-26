package com.fanglin.decoration.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationMidpackPO;

public interface DecorationMidpackDao extends Dao<DecorationMidpackPO> {

	public DecorationMidpackPO queryDecorationMidpack(String orderId); 
}
