package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.AssisOrderPO;
import com.fanglin.utils.Paging;

public interface AssisOrderDao extends Dao<AssisOrderPO>{
	
	public List<AssisOrderPO> pageAssisOrder(Paging paging,List<Filter> filters);
	
}
