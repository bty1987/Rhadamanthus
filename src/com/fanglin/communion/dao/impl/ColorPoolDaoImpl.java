package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.ColorPoolDao;
import com.fanglin.communion.po.ColorPoolPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("colorPoolDao")
public class ColorPoolDaoImpl extends DaoImpl<ColorPoolPO> implements ColorPoolDao {

	public ColorPoolDaoImpl() {
		super(ColorPoolPO.class);
	}

	@Override
	public List<ColorPoolPO> pageColorPool(Paging paging, List<Filter> filters) {

		PagingQuery<ColorPoolPO> query = pagingQuery(paging, ColorPoolPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ColorPoolPO> queryColorPoolByGpid(long gpid) {
		return session().createCriteria(ColorPoolPO.class).createAlias("goodsPool", "goodsPool").add(Restrictions.eq(ColorPoolPO.COLUMN_GPID_STR, gpid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ColorPoolPO> queryColorPoolForEnableByGpid(long gpid) {
		return session().createCriteria(ColorPoolPO.class).createAlias("goodsPool", "goodsPool").add(Restrictions.eq(ColorPoolPO.COLUMN_GPID_STR, gpid)).add(Restrictions.eq(ColorPoolPO.COLUMN_STATUS_STR, ColorPoolPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public ColorPoolPO queryColorPoolByName(long gpid, String name) {
		return (ColorPoolPO) session().createCriteria(ColorPoolPO.class).createAlias("goodsPool", "goodsPool").add(Restrictions.eq(ColorPoolPO.COLUMN_GPID_STR, gpid)).add(Restrictions.eq(ColorPoolPO.COLUMN_NAME_STR, name)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (ColorPoolPO.COLUMN_NAME_STR.equals(filter.getField())) {
				query.add(query.getCriterion(field, data, op));
			} else if (ColorPoolPO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			}
		}
	}

}
