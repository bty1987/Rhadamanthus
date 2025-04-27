package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.FormatPoolDao;
import com.fanglin.communion.po.FormatPoolPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.FormatPO;
import com.fanglin.utils.Paging;

@Repository("formatPoolDao")
public class FormatPoolDaoImpl extends DaoImpl<FormatPoolPO> implements FormatPoolDao {

	public FormatPoolDaoImpl() {
		super(FormatPoolPO.class);
	}

	@Override
	public List<FormatPoolPO> pageFormatPool(Paging paging, List<Filter> filters) {

		PagingQuery<FormatPoolPO> query = pagingQuery(paging, FormatPoolPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<FormatPoolPO> queryFormatPoolByGpid(long gpid) {
		return session().createCriteria(FormatPoolPO.class).createAlias("goodsPool", "goodsPool").add(Restrictions.eq(FormatPoolPO.COLUMN_GPID_STR, gpid)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<FormatPoolPO> queryFormatPoolForEnableByGpid(long gpid) {
		return session().createCriteria(FormatPoolPO.class).createAlias("goodsPool", "goodsPool").add(Restrictions.eq(FormatPoolPO.COLUMN_GPID_STR, gpid)).add(Restrictions.eq(FormatPoolPO.COLUMN_STATUS_STR, FormatPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public FormatPoolPO queryFormatPoolByInfo(long gpid, String info) {
		return (FormatPoolPO) session().createCriteria(FormatPoolPO.class).createAlias("goodsPool", "goodsPool").add(Restrictions.eq(FormatPoolPO.COLUMN_GPID_STR, gpid)).add(Restrictions.eq(FormatPoolPO.COLUMN_INFO_STR, info)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (FormatPoolPO.COLUMN_INFO_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (FormatPoolPO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			}
		}
	}
}
