package com.fanglin.data.common.dao.impl;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.HolidayDao;
import com.fanglin.data.po.HolidayPO;
import com.fanglin.utils.Paging;

@Repository("holidayDao")
public class HolidayDaoImpl extends DaoImpl<HolidayPO> implements HolidayDao {

	public HolidayDaoImpl() {
		super(HolidayPO.class);
	}

	@Override
	public List<HolidayPO> pageHoliday(Paging paging, List<Filter> filters) {

		PagingQuery<HolidayPO> query = pagingQuery(paging, HolidayPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<HolidayPO> queryHoliday(String period, Timestamp starTime, Timestamp endTime, Short atttype) {

		Criteria criteria = session().createCriteria(HolidayPO.class);

		if (period != null) {
			criteria.add(Restrictions.eq(HolidayPO.COLUMN_PERIOD_STR, period));
		}

		if (starTime != null) {
			criteria.add(Restrictions.ge(HolidayPO.COLUMN_STARTTIME_STR, starTime));
		}

		if (endTime != null) {
			criteria.add(Restrictions.le(HolidayPO.COLUMN_ENDTIME_STR, endTime));
		}

		if (atttype != null) {
			criteria.add(Restrictions.in("atttype", Arrays.asList(atttype, HolidayPO.ATTTYPE_COMMON_INT)));
		}

		return criteria.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (HolidayPO.COLUMN_PERIOD_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (HolidayPO.COLUMN_STARTTIME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (HolidayPO.COLUMN_ENDTIME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			}
		}
	}

}
