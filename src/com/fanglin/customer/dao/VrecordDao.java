package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.VrecordPO;

public interface VrecordDao extends Dao<VrecordPO>{
	
	public List<VrecordPO> queryVrecordByVid(long vid);
	
}
