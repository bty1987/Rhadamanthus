package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.PricePoolDao;
import com.fanglin.communion.po.PricePoolPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("pricePoolDao")
public class PricePoolDaoImpl extends DaoImpl<PricePoolPO> implements PricePoolDao {

	public PricePoolDaoImpl() {
		super(PricePoolPO.class);
	}

	@Override
	public List<PricePoolPO> pagePricePool(Paging paging, List<Filter> filters) {

		PagingQuery<PricePoolPO> query = pagingQuery(paging, PricePoolPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<PricePoolPO> queryPricePoolByGpid(long gpid, Short status) {

		Criteria criteria = session().createCriteria(PricePoolPO.class).createAlias("goodsPool", "goodsPool").add(Restrictions.eq(PricePoolPO.COLUMN_GPID_STR, gpid));

		if (status != null) {
			criteria.add(Restrictions.eq(PricePoolPO.COLUMN_STATUS_STR, status));
		}

		return criteria.list();
	}

	@Override
	public PricePoolPO queryPricePoolByPpid(long ppid) {
		return (PricePoolPO) session().createCriteria(PricePoolPO.class).add(Restrictions.eq(PricePoolPO.COLUMN_PPID_STR, ppid)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (PricePoolPO.COLUMN_NAME_STR.equals(filter.getField())) {
				query.add(query.getCriterion(field, data, op));
			} else if (PricePoolPO.COLUMN_TYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if (PricePoolPO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			}
		}
	}

}
