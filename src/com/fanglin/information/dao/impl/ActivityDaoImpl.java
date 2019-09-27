/**
 * @File Name	: ActivityDaoImpl.java
 * @Package   	: com.fanglin.information.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao.impl;

import java.util.Arrays;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.utils.Paging;

@Repository("activityDao")
public class ActivityDaoImpl extends DaoImpl<ActivityPO> implements ActivityDao {

	public ActivityDaoImpl() {
		super(ActivityPO.class);
	}

	@Override
	public List<ActivityPO> pageActivity(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ActivityPO> query = pagingQuery(paging, ActivityPO.class);

		query.add(Restrictions.in("status", Arrays.asList(ActivityPO.STATUS_VALID_INT, ActivityPO.STATUS_UNVALID_INT)));
		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ActivityPO> queryActivityForValid(int company, short type) {
		return session().createCriteria(ActivityPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(ActivityPO.COLUMN_STATUS_STR, ActivityPO.STATUS_VALID_INT)).add(Restrictions.eq(ActivityPO.COLUMN_TYPE_STR, type)).list();
	}

	@Override
	public ActivityPO queryActivityForDefault(short type) {
		return (ActivityPO) session().createCriteria(ActivityPO.class).add(Restrictions.eq(ActivityPO.COLUMN_DEFAULTS_STR, ActivityPO.DEFAULTS_DEFAULT_INT)).add(Restrictions.eq(ActivityPO.COLUMN_STATUS_STR, ActivityPO.STATUS_VALID_INT)).add(Restrictions.eq(ActivityPO.COLUMN_TYPE_STR, type)).uniqueResult();
	}

	@Override
	public int resetActivityForDefault(short type) {

		String sql = "update information.activity set defaults = :defaults where type = :type";
		session().createSQLQuery(sql).setShort("defaults", ActivityPO.DEFAULTS_COMMON_INT).setShort("type", type).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		query.alias("creater", "creater");

		if (filters != null) {
			for (Filter filter : filters) {

				if (ActivityPO.COLUMN_STATUS_STR.equals(filter.getField())) {
					query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
				} else if (ActivityPO.COLUMN_TYPE_STR.equals(filter.getField())) {
					query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
				} else {
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}
			}
		}

	}

}
