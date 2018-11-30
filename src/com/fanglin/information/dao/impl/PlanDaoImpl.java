package com.fanglin.information.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.PlanDao;
import com.fanglin.information.po.PlanPO;
import com.fanglin.utils.Paging;

@Repository("planDao")
public class PlanDaoImpl extends DaoImpl<PlanPO> implements PlanDao {

	public PlanDaoImpl() {
		super(PlanPO.class);
	}

	@Override
	public List<PlanPO> pagePlan(Paging paging, List<Filter> filters, int uid, int company) {
		
		PagingQuery<PlanPO> query = pagingQuery(paging, PlanPO.class);
		
		query.add(query.getCriterion("company", (long)company, "eq"));
		
		query.add(Restrictions.eq("creater.uid", uid));
		
		queryFilterExecute(query, filters);
		
		query.desc("pid");

		return query.list();
	}

	@Override
	public int countPlanByCuid(long cuid) {

		String sql = "select count(*) from information.plan where cuid = :cuid and status = :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong(PlanPO.COLUMN_CUID_STR, cuid).setShort(PlanPO.COLUMN_STATUS_STR, PlanPO.STATUS_INIT_INT).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countPlanByExecuteTime(String executeTime) {

		String sql = "select count(*) from information.plan where executeTime= :executeTime and status = :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString(PlanPO.COLUMN_EXECUTETIME_STR, executeTime).setShort(PlanPO.COLUMN_STATUS_STR, PlanPO.STATUS_INIT_INT).uniqueResult();

		return count.intValue();
	}
	@Override
	public int countPlanByExecuteTimAndCuid(String executeTime, long cuid) {
		String sql = "select count(*) from information.plan where executeTime= :executeTime and status = :status and cuid = :cuid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString(PlanPO.COLUMN_EXECUTETIME_STR, executeTime).setShort(PlanPO.COLUMN_STATUS_STR, PlanPO.STATUS_INIT_INT).setLong(PlanPO.COLUMN_CUID_STR, cuid).uniqueResult();

		return count.intValue();
	}


	@Override
	public int countPlanRightNow() {
		
		String sql = "select count(*) from information.plan where executeTime is null and status = :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setShort(PlanPO.COLUMN_STATUS_STR, PlanPO.STATUS_IMME_INT).uniqueResult();

		return count.intValue();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){
		
		if (filters != null) {
			
			query.alias("task", "task");
			
			for (Filter filter : filters) {
				
				String field = filter.getField();
				String data = filter.getData();

				if ("taskName".equals(field)) {
					query.add(Restrictions.eq("task.tid", Long.parseLong(data)));
				}
			}
		}
	}


}
