package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.WorkplanPO;
import com.fanglin.utils.Paging;

public interface WorkplanDao extends Dao<WorkplanPO> {
	
	public List<WorkplanPO> pageWorkplan(Paging paging, List<Filter> filters,int company);
	
	public List<WorkplanPO> queryWorkplanByWsid(long wsid,int company);
	
	public List<WorkplanPO> queryWorkplan(int company);
}
