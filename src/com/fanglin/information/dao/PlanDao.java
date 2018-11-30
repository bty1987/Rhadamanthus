package com.fanglin.information.dao;

import java.util.List;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.PlanPO;
import com.fanglin.utils.Paging;
public interface PlanDao extends Dao<PlanPO> {
	
	public List<PlanPO> pagePlan(Paging paging,List<Filter> filters, int uid,int company);
	
	public int countPlanByCuid(long cuid);
	
	public int countPlanByExecuteTime(String executeTime);
	
	public int countPlanByExecuteTimAndCuid(String executeTime,long cuid);

	public int countPlanRightNow();

	
}
