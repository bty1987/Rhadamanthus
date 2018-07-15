package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationServicePO;

public interface DecorationServiceDao extends Dao<DecorationServicePO>{

	public List<DecorationServicePO> queryDecorationServiceByOrderId(String orderId);
	
}
