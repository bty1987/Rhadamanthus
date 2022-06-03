package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DroupDao;
import com.fanglin.customer.po.DroupPO;
import com.fanglin.utils.Paging;

@Repository("droupDao")
public class DroupDaoImpl extends DaoImpl<DroupPO> implements DroupDao {

	public DroupDaoImpl() {
		super(DroupPO.class);
	}

	@Override
	public List<DroupPO> pageDroup(Paging paging, List<Filter> filters) {

		PagingQuery<DroupPO> query = pagingQuery(paging, DroupPO.class);

		queryFilterExecute(query, filters);

		query.asc("isHandle");
		query.asc("updateTime");

		return query.list();
	}

	@Override
	public DroupPO queryDroup(String orderId, String chatId, String openId) {

		Criteria query = session().createCriteria(DroupPO.class);

		if (orderId != null) {
			query.createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId));
		}

		if (chatId != null) {
			query.add(Restrictions.eq(DroupPO.COLUMN_CHATID_STR, chatId));
		}

		if (openId != null) {
			query.add(Restrictions.eq(DroupPO.COLUMN_OPENID_STR, openId));
		}

		return (DroupPO) query.uniqueResult();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			query.alias("decoration", "decoration");
			query.alias("decoration.customer", "customer");

			if ("orderId".equals(field)) {
				query.add(query.getCriterion("decoration.orderId", data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("name".equals(field)) {
				query.add(query.getCriterion(DroupPO.COLUMN_CUSTOMER_STR, data, op));
			} else if ("updateTime".equals(field)) {
				query.timeranges("updateTime", data);
			} else if ("handleTime".equals(field)) {
				query.timeranges("handleTime", data);
			} else if ("isHandle".equals(field)) {
				query.add(query.getCriterion("isHandle", Short.valueOf(data), op));
			}
		}

	}

}
