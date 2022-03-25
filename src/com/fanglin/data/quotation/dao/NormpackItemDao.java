package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.NormpackItemPO;

public interface NormpackItemDao extends Dao<NormpackItemPO>{
	
	public List<NormpackItemPO> queryNormpackItem(long npid);
	
}
