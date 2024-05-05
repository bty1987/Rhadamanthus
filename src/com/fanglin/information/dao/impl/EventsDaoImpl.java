/**
 * @File Name		: EventsDaoImpl.java
 * @Package   	: com.fanglin.information.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-11-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.EventsDao;
import com.fanglin.information.po.EventsPO;
import com.fanglin.utils.Paging;

@Repository("eventsDao")
public class EventsDaoImpl extends DaoImpl<EventsPO> implements EventsDao {

	public EventsDaoImpl() {
		super(EventsPO.class);
	}

	@Override
	public List<EventsPO> queryEvents(List<Filter> filters) {

		PagingQuery<EventsPO> query = pagingQuery(new Paging(), EventsPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<EventsPO> queryEvents(int uid, Integer beginDate, Integer endDate) {
		return session().createCriteria(EventsPO.class).createAlias("holder", "holder").add(Restrictions.eq("holder.uid", uid)).add(Restrictions.ge(EventsPO.COLUMN_SHOWDATE_STR, beginDate)).add(Restrictions.le(EventsPO.COLUMN_SHOWDATE_STR, endDate)).list();
	}

	@Override
	public int countEvents(int uid, Integer showDate) {

		String sql = "select count(*) from information.events where huid = :huid and showDate = :showDate";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("huid", uid).setInteger("showDate", showDate).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("showDate".equals(field)) {
				query.add(query.getCriterion(EventsPO.COLUMN_SHOWDATE_STR, data, op));
			} else if ("showDateRange".equals(field)) {
				query.timeranges(EventsPO.COLUMN_SHOWDATE_STR, EventsPO.COLUMN_SHOWDATE_STR, data);
			}
		}
	}
}
