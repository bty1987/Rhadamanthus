package com.fanglin.customer.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.DecorationCircleBackgroundPO;

public interface DecorationCircleBackgroundDao extends Dao<DecorationCircleBackgroundPO>{
	
	public DecorationCircleBackgroundPO queryDecorationCircleBackgroundByUnionId(String unionId);

}
