package com.fanglin.production.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.ProductionPlanDao;
import com.fanglin.production.po.ProductionPlanPO;
import com.fanglin.utils.Paging;

@Repository("ProductionPlanDao")
public class ProductionPlanDaoImpl extends DaoImpl<ProductionPlanPO> implements ProductionPlanDao {

	public ProductionPlanDaoImpl() {
		super(ProductionPlanPO.class);
	}

	@Override
	public List<ProductionPlanPO> pageProductionPlan(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ProductionPlanPO> query = pagingQuery(paging, ProductionPlanPO.class);

		query.add(query.getCriterion(ProductionPlanPO.COLUMN_COMPANY_STR, company, "eq"));
		queryFilterExcute(query, filters);

		query.desc("ppid");

		return query.list();
	}

	@Override
	public ProductionPlanPO queryProductionPlanByNo(String no) {
		return (ProductionPlanPO) session().createCriteria(ProductionPlanPO.class).add(Restrictions.eq(ProductionPlanPO.COLUMN_NO_STR, no)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProductionPlanPO> queryProductionPlanByPid(long pid) {
		return session().createCriteria(ProductionPlanPO.class).add(Restrictions.eq(ProductionPlanPO.COLUMN_PID_STR, pid)).list();
	}

	@Override
	public int countProductionPlan(Long pid, Short status) {

		String sql = "select count(*) from production.productionplan where pid = :pid and status < :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("pid", pid).setShort("status", status).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<ProductionPlanPO> query, List<Filter> filters) {

		if (filters != null) {

			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				query.alias("production", "production");
				query.alias("production.house", "house");

				if (field.startsWith("creater")) {
					query.alias("creater", "creater");

					if (field.contains("Department")) {
						query.alias("creater.dept", "createrDept");
					}

					if (field.contains("Region")) {
						query.alias("creater.dept", "createrDept");
						query.alias("createrDept.fatherDept", "createrRegion");
					}
				} else if (field.startsWith("village")) {
					query.alias("house.village", "village");
				}

				if (ProductionPlanPO.COLUMN_STATUS_STR.equals(field)) {
					query.add(query.getCriterion(ProductionPlanPO.COLUMN_STATUS_STR, Short.parseShort(data), op));
				} else if (ProductionPlanPO.COLUMN_PNO_STR.equals(field)) {
					query.add(query.getCriterion(ProductionPlanPO.COLUMN_PRODUCTIONPNO_STR, data, op));
				} else if (ProductionPlanPO.COLUMN_NO_STR.equals(field)) {
					query.add(query.getCriterion(ProductionPlanPO.COLUMN_NO_STR, data, op));
				} else if ("houseNumber".equals(field)) {
					query.add(query.getCriterion("house.houseNumber", data, op));
				} else if ("orderId".equals(field)) {
					query.add(query.getCriterion("production.orderId", data, op));
				} else if ("createrId".equals(field)) {
					query.add(query.getCriterion("creater.userId", data, op));
				} else if ("villageId".equals(field)) {
					query.add(query.getCriterion("village.no", data, op));
				} else if (ProductionPlanPO.COLUMN_STRATTIME_STR.equals(field)) {
					query.timeranges("createTime", data);
				} else if (ProductionPlanPO.COLUMN_ENDTIME_STR.equals(field)) {
					query.timeranges("finishTime", data);
				}
			}
		}
	}

}
