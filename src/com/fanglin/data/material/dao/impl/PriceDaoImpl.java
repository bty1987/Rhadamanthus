package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.PriceDao;
import com.fanglin.data.po.PriceGO;
import com.fanglin.data.po.PricePO;
import com.fanglin.utils.Paging;

@Repository("priceDao")
public class PriceDaoImpl extends DaoImpl<PricePO> implements PriceDao {

	public PriceDaoImpl() {
		super(PricePO.class);
	}

	@Override
	public List<PriceGO> pagePrice(Paging paging, List<Filter> filters, int company) {

		PagingQuery<PriceGO> query = pagingQuery(paging, PriceGO.class);
		query.add(query.getCriterion("goods.company", company, "eq"));
		queryFilterExcute(query, filters);

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<PricePO> queryPriceByGid(long gid, Short status) {

		Criteria criteria = session().createCriteria(PricePO.class).add(Restrictions.eq(PricePO.COLUMN_GID_STR, gid));

		if (status != null) {
			criteria.add(Restrictions.eq(PricePO.COLUMN_STATUS_STR, status));
		}

		return criteria.list();
	}

	@Override
	public PricePO queryPriceByPid(long pid) {
		return (PricePO) session().createCriteria(PricePO.class).add(Restrictions.eq(PricePO.COLUMN_PID_STR, pid)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("goods", "goods");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("goods".equals(filter.getField())) {
				query.add(query.getCriterion("goods.no", data, op));
			} else if ("goods".equals(field)) {
				query.add(query.getCriterion("goods.name", data, op));
			} else if ("goods".equals(field)) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			}
		}
	}

}
