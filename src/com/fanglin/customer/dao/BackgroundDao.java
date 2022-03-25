package com.fanglin.customer.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.BackgroundPO;

public interface BackgroundDao extends Dao<BackgroundPO> {

	public BackgroundPO queryBackgroundByUnionId(String unionId);

}
