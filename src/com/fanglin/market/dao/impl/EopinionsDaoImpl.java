package com.fanglin.market.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.EopinionsDao;
import com.fanglin.market.po.EopinionsPO;
import com.fanglin.utils.Paging;

@Repository("eopinionsDao")
public class EopinionsDaoImpl extends DaoImpl<EopinionsPO> implements EopinionsDao {

	public EopinionsDaoImpl() {
		super(EopinionsPO.class);
	}

	@Override
	public List<EopinionsPO> pageEopinions(Paging paging, List<Filter> filters) {

		PagingQuery<EopinionsPO> query = pagingQuery(paging, EopinionsPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<EopinionsPO> queryEopinionsByType(short type) {
		return createCriteria(EopinionsPO.class).add(Restrictions.eq(EopinionsPO.COLUMN_TYPE_STR, type)).list();
	}

	private void queryFilterExcute(PagingQuery<EopinionsPO> query,List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if(field.equals("type")){
					query.add(query.getCriterion("type", Short.valueOf(data), op));
				}
			}
		}
	}

}
