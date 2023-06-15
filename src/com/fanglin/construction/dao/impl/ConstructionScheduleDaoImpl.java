package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionScheduleDO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("constructionScheduleDao")
public class ConstructionScheduleDaoImpl extends DaoImpl<ConstructionSchedulePO> implements ConstructionScheduleDao {

	public ConstructionScheduleDaoImpl() {
		super(ConstructionSchedulePO.class);
	}

	@Override
	public List<ConstructionScheduleDO> pageConstructionSchedule(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<ConstructionScheduleDO> query = pagingQuery(paging, ConstructionScheduleDO.class);

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionSchedulePO> queryConstructionScheduleByOrderId(String orderId) {
		return session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionSchedulePO> queryConstructionScheduleByCid(Long cid) {
		return session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_CID_STR, cid)).list();
	}

	@Override
	public ConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId, short schedule) {
		return (ConstructionSchedulePO) session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, schedule)).uniqueResult();
	}

	@Override
	public ConstructionSchedulePO queryConstructionSchedule(String orderId, long cnid) {
		return (ConstructionSchedulePO) session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_CNID_STR, cnid)).uniqueResult();
	}

	@Override
	public ConstructionSchedulePO queryConstructionScheduleByCid(long cid, short schedule) {
		return (ConstructionSchedulePO) session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_CID_STR, cid)).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, schedule)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("decoration", "decoration");
		query.alias("decoration.house", "house");
		query.alias("house.village", "village");
		query.alias("construction", "construction");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("orderId".equals(field)) {
				query.alias("decoration.house", "house");
				query.add(query.getCriterion("decoration.orderId", data, op));
			} else if ("decorationStatus".equals(field)) {
				query.add(query.getCriterion("decoration.projectStatus", Short.parseShort(data), op));
			} else if ("village".equals(field)) {
				query.alias("house.village", "village");
				query.add(query.getCriterion("village.no", data, op));
			} else if ("designer".equals(field)) {
				query.alias("decoration.designer", "designer");
				query.add(query.getCriterion("designer.userId", (data), op));
			} else if ("salesman".equals(field)) {
				query.alias("decoration.salesman", "salesman");
				query.add(query.getCriterion("salesman.userId", data, op));
			} else if ("designerDepartmentId".equals(field)) {
				query.alias("designer.dept", "designerDept");
				query.add(query.getCriterion("designerDept.no", data, op));
			} else if ("designerRegionId".equals(field)) {
				query.alias("designerDept.fatherDept", "designerRegion");
				query.add(query.getCriterion("designerRegion.no", data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			} else if ("schedule".equals(field)) {
				query.add(query.getCriterion("schedule", Short.parseShort(data), op));
			} else if ("cnid".equals(field)) {
				query.add(query.getCriterion("cnid", Long.parseLong(data), op));
			} else if ("startTime".equals(field)) {
				query.timeranges(ConstructionScheduleDO.COLUMN_STATUSTIME_STR, data);
			} else if ("endTime".equals(field)) {
				query.timeranges(ConstructionScheduleDO.COLUMN_FINISHTIME_STR, data);
			} else if ("createTime".equals(field)) {
				query.timeranges(ConstructionScheduleDO.COLUMN_CREATETIME_STR, data);
			}
		}
	}
}
