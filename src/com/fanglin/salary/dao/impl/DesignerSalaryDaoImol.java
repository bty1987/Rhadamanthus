package com.fanglin.salary.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.DesignerSalaryDao;
import com.fanglin.salary.po.DesignerSalaryPO;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.utils.Paging;

@Repository("designerSalaryDao")
public class DesignerSalaryDaoImol extends DaoImpl<DesignerSalaryPO> implements DesignerSalaryDao {

	private DesignerSalaryDaoImol() {
		super(DesignerSalaryPO.class);
	}

	@Override
	public List<DesignerSalaryPO> pageDesignerSalary(Paging paging, List<Filter> filter) {

		PagingQuery<DesignerSalaryPO> query = pagingQuery(paging, DesignerSalaryPO.class);

		queryFilterExcute(query, filter);

		return query.list();
	}

	@Override
	public DesignerSalaryPO queryDesignerSalaryByDuid(long duid) {
		return (DesignerSalaryPO) session().createCriteria(DesignerSalaryPO.class).add(Restrictions.eq(DesignerSalaryPO.COLUMN_DUID_STR, duid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public void deleteDesignerSalary(long dsid) {

		String sql = "delete from platform.designersalary where dsid = :dsid";
		session().createSQLQuery(sql).setLong("dsid", dsid).executeUpdate();
	}

	private void queryFilterExcute(PagingQuery<DesignerSalaryPO> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String filet = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("userName".equals(filet)) {
				query.alias("duser", "duser");
				query.add(query.getCriterion("duser.userName", data, op));
			} else if ("status".equals(filet)) {
				query.add(query.getCriterion(DesignerSalaryPO.STATUS_INIT_STRA, Short.parseShort(data), op));
			} else if ("approveTime".equals(filter.getField())) {
				query.timeranges(WorkerSalaryPO.COLUMN_APPROVETIME_STR, data);
			} else if ("createTime".equals(filter.getField())) {
				query.timeranges(WorkerSalaryPO.COLUMN_CREATETIME_STR, data);
			}
		}
	}
}