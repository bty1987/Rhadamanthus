package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.AssisTypePO;
import com.fanglin.utils.Paging;

public interface AssisTypeDao extends Dao<AssisTypePO>{

	public List<AssisTypePO> pageAssisType(Paging paging, List<Filter> filters);
	
	public List<AssisTypePO> queryAssisType();
	
	public List<AssisTypePO> queryAssisTypeByWtid(int wtid);
	
}
