package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.PlanPO;
import com.fanglin.utils.Paging;

public interface PlanDao extends Dao<PlanPO> {

	public List<PlanPO> pagePlan(Paging paging, List<Filter> filters, int uid, int company);

	public List<PlanPO> existPlan(long tid, String args, int company);

	public int countPlan(long cuid);

	public int countPlan(String executeTime);

	public int countPlan(String executeTime, long cuid);

	public int countPlanRightNow();

}
