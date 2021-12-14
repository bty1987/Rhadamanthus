package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceSalesDao;
import com.fanglin.balance.po.BalanceSalesPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceSalesDao")
public class BalanceSalesDaoImpl extends DaoImpl<BalanceSalesPO> implements BalanceSalesDao {

	public BalanceSalesDaoImpl() {
		super(BalanceSalesPO.class);
	}

	@Override
	public List<BalanceSalesPO> pageBalanceSales(Paging paging, List<Filter> filters, int company) {

		PagingQuery<BalanceSalesPO> query = pagingQuery(paging, BalanceSalesPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		query.asc("bsid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceSalesPO> queryBalanceSales(String name, int company) {
		return session().createCriteria(BalanceSalesPO.class).add(Restrictions.ilike("name", name, MatchMode.ANYWHERE)).add(Restrictions.eq("status", BalanceSalesPO.STATUS_INIT_INT)).add(Restrictions.eq("company", company)).setMaxResults(10).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("name".equals(field)) {
					query.add(Restrictions.ilike("name", data, MatchMode.ANYWHERE));
				} else if ("status".equals(field)) {
					query.add(Restrictions.eq("status", Short.valueOf(data)));
				} else if ("grade".equals(field)) {
					query.add(query.getCriterion("grade", data, op));
				} else if ("createTimeDateRange".equals(field)) {
					query.timeranges("createTime", "createTime", data);
				} else if ("createrId".equals(field)) {
					query.alias("creater", "creater");
					query.add(query.getCriterion("creater.userId", data, op));
				} else if ("brandId".equals(field)) {
					query.alias("brand", "brand");
					query.add(query.getCriterion("brand.bid", Long.valueOf(data), op));
				}
			}
		}
	}

}
