package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.VrecordPO;
import com.fanglin.core.dao.Dao;

public interface VrecordDao extends Dao<VrecordPO>{
	
	public List<VrecordPO> queryVrecordByVid(long vid);
	
}
