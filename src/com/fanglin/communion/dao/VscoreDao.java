package com.fanglin.communion.dao;

import com.fanglin.communion.po.VscorePO;
import com.fanglin.core.dao.Dao;

public interface VscoreDao extends Dao<VscorePO> {
	
	public VscorePO queryVscoreByUnionId(String unionId);

}
