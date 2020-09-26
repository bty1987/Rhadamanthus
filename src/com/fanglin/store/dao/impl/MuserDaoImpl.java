package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.MuserDao;
import com.fanglin.store.po.MuserPO;
import com.fanglin.utils.Paging;

@Repository("muserDao")
public class MuserDaoImpl extends DaoImpl<MuserPO> implements MuserDao {

	public MuserDaoImpl() {
		super(MuserPO.class);
	}

	@Override
	public List<MuserPO> pageMuser(Paging paging, List<Filter> filters) {

		PagingQuery<MuserPO> query = pagingQuery(paging, MuserPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public MuserPO queryMuserByUnionId(String unionId) {
		return (MuserPO) session().createCriteria(MuserPO.class).add(Restrictions.eq(MuserPO.COLUMN_UNIONID_STR, unionId)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		for (Filter filter : filters) {
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("name")) {
				query.add(query.getCriterion(field, data, op));
			}
		}
	}

}
