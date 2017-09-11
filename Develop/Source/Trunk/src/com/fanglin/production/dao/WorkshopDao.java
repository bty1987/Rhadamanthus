package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.WorkshopPO;
import com.fanglin.utils.Paging;

public interface WorkshopDao extends Dao<WorkshopPO>{

	public List<WorkshopPO> pageWorkshop(Paging paging, List<Filter> filters, int company);
	
	public List<WorkshopPO> queryWorkshop(int company);
	
}
