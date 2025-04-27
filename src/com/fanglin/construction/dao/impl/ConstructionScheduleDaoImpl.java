package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionScheduleDO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("constructionScheduleDao")
public class ConstructionScheduleDaoImpl extends DaoImpl<ConstructionSchedulePO> implements ConstructionScheduleDao {

	public ConstructionScheduleDaoImpl() {
		super(ConstructionSchedulePO.class);
	}

	@Override
	public List<ConstructionScheduleDO> pageConstructionSchedule(Paging paging, List<Filter> filters, Integer company) throws FLException {

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
	public List<ConstructionSchedulePO> queryConstructionScheduleByCid(long cid) {
		return session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_CID_STR, cid)).list();
	}

	@Override
	public ConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId, short schedule) {
		return (ConstructionSchedulePO) session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, schedule)).setMaxResults(1).uniqueResult();
	}

	@Override
	public ConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId, long cnid) {
		return (ConstructionSchedulePO) session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_CNID_STR, cnid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public ConstructionSchedulePO queryConstructionScheduleByCid(long cid, short schedule) {
		return (ConstructionSchedulePO) session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_CID_STR, cid)).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, schedule)).setMaxResults(1).uniqueResult();
	}

	@Override
	public ConstructionSchedulePO queryConstructionScheduleByCid(long cid, long cnid) {
		return (ConstructionSchedulePO) session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_CID_STR, cid)).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_CNID_STR, cnid)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		ConstructionDaoImpl.queryFilterExcute(query, filters, "construction");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("cnid".equals(field)) {
				query.add(query.getCriterion("cnid", Long.parseLong(data), op));
			} else if ("startTime".equals(field)) {
				query.timeranges(ConstructionScheduleDO.COLUMN_STATUSTIME_STR, data);
			} else if ("endTime".equals(field)) {
				query.timeranges(ConstructionScheduleDO.COLUMN_FINISHTIME_STR, data);
			} else if ("createTime".equals(field)) {
				query.timeranges(ConstructionScheduleDO.COLUMN_CREATETIME_STR, data);
			} else if ("enterTime".equals(field)) {
				query.timeranges(ConstructionScheduleDO.COLUMN_ENTERTIME_STR, data);
			} else if ("leaveTime".equals(field)) {
				query.timeranges(ConstructionScheduleDO.COLUMN_LEAVETIME_STR, data);
			}
		}
	}
}
