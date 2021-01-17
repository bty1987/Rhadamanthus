package com.fanglin.log.dao.impl;

import java.sql.Timestamp;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Query;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.LoginLogDao;
import com.fanglin.log.po.LoginLogPO;
import com.fanglin.utils.Paging;

@Repository("loginLogDao")
public class LoginLogDaoImpl extends DaoImpl<LoginLogPO> implements LoginLogDao {

	@Override
	public List<LoginLogPO> getPageLoginLog(Paging paging, List<Filter> filters) {

		PagingQuery<LoginLogPO> query = pagingQuery(paging, LoginLogPO.class);

		queryFilterExcute(query, filters);

		query.desc("loginTime");

		return query.list();
	}

	@Override
	public void delteBeforLoginTime(Timestamp beforeTime) {

		Query query = session().createQuery("delete LoginLogPO l where l.loginTime=?");
		query.setTimestamp(0, beforeTime);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<LoginLogPO> getLoginLogByLoginIdAndStartEndTime(String loginId, Timestamp start, Timestamp end) {

		return session().createCriteria(LoginLogPO.class).add(Restrictions.eq("loginId", loginId)).add(Restrictions.ge("loginTime", start)).add(Restrictions.le("loginTime", end)).addOrder(Order.desc("loginTime")).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (!StringUtils.isNotEmpty(data))
				continue;

			if ("loginId".equals(field)) {
				query.add(query.getCriterion("loginId", data, op));
			} else if ("sourceIp".equals(field)) {
				query.add(query.getCriterion("sourceIp", data, op));
			} else if ("successFlag".equals(field)) {
				query.add(query.getCriterion("successFlag", Integer.parseInt(data), op));
			} else if ("loginTime".equals(field) && "between".equals(op)) {
				query.timeranges("loginTime", data);
			} else if ("loginTime".equals(field)) {
				query.add(query.getCriterion("loginTime", data, op));
			}
		}
	}

}
