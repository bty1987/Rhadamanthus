package com.fanglin.production.dao;

import java.util.List;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.WorkflowPO;
import com.fanglin.utils.Paging;

public interface WorkflowDao extends Dao<WorkflowPO> {
	
	public  List<WorkflowPO>  pageWorkflow (Paging paging, List<Filter> filter, int company);
	
	public 	List<WorkflowPO> queryWorkflow(int Company);
	
}
