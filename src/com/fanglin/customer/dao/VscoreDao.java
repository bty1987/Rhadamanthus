package com.fanglin.customer.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.VscorePO;

public interface VscoreDao extends Dao<VscorePO> {
	
	public VscorePO queryVscoreByUnionId(String unionId);

}
