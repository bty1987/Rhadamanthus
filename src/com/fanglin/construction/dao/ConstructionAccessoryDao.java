package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructionAccessoryPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionAccessoryDao extends Dao<ConstructionAccessoryPO>{
	
	public List<ConstructionAccessoryPO> pageConstructionAccessory(Paging paging, List<Filter> filters, long cid);
	
	public ConstructionAccessoryPO queryConstructionAccessory(long cid, long gid);
	
	public int makeConstructionAccessory(long cid, long ccid);
	
	public int countConstructionAccessory(long cid);
	
}
