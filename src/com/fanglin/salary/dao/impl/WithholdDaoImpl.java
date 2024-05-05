package com.fanglin.salary.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.WithholdDao;
import com.fanglin.salary.po.WithholdPO;
import com.fanglin.utils.Paging;

@Repository("WithholdDao")
public class WithholdDaoImpl extends DaoImpl<WithholdPO> implements WithholdDao {

	public WithholdDaoImpl() {
		super(WithholdPO.class);
	}

	@Override
	public List<WithholdPO> pageWithhold(Paging paging, List<Filter> filters) {

		PagingQuery<WithholdPO> query = pagingQuery(paging, WithholdPO.class);

		queryFilterExcuteForWorker(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WithholdPO> queryWithhold(long ident, short type) {
		return session().createCriteria(WithholdPO.class).add(Restrictions.eq("ident", ident)).add(Restrictions.eq(WithholdPO.CHECKUP_TYPE_SHORT, type)).list();
	}

	private void queryFilterExcuteForWorker(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("user", "user");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("userId".equals(field)) {

				query.add(query.getCriterion("user.userId", data, op));
			} else if ("userName".equals(field)) {
				query.add(query.getCriterion("user.userName", data, op));
			} else if ("orderId".equals(field)) {
				query.add(query.getCriterion("orderId", data, op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.parseShort(data), op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(WithholdPO.COLUMN_STATUS_STR, Short.parseShort(data), op));
			} else if ("operateTime".equals(field)) {
				query.timeranges(WithholdPO.COLUMN_OPERATETIME_STR, data);
			} else if ("createTime".equals(field)) {
				query.timeranges(WithholdPO.COLUMN_CREATETIME_STR, data);
			}
		}
	}

}
