package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.GoodsKindDao;
import com.fanglin.data.po.GoodsKindPO;
import com.fanglin.utils.Paging;

@Repository("goodsKindDao")
public class GoodsKindDaoImpl extends DaoImpl<GoodsKindPO> implements GoodsKindDao {

	public GoodsKindDaoImpl() {
		super(GoodsKindPO.class);
	}

	@Override
	public List<GoodsKindPO> pageGoodsKind(Paging paging, List<Filter> filters) {

		PagingQuery<GoodsKindPO> query = pagingQuery(paging, GoodsKindPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsKindPO> queryGoodsKind() {
		return session().createCriteria(GoodsKindPO.class).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (GoodsKindPO.COLUMN_NO_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (GoodsKindPO.COLUMN_NAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (GoodsKindPO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

}
