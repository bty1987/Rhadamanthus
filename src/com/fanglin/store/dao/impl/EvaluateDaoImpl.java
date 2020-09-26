package com.fanglin.store.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.EvaluateDao;
import com.fanglin.store.po.EvaluatePO;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.utils.Paging;

@Repository("evaluateDao")
public class EvaluateDaoImpl extends DaoImpl<EvaluatePO> implements EvaluateDao {

	public EvaluateDaoImpl() {
		super(EvaluatePO.class);
	}

	@Override
	public List<EvaluatePO> pageEvaluate(Paging paging, List<Filter> filters) {

		PagingQuery<EvaluatePO> query = pagingQuery(paging, EvaluatePO.class);

		queryFilterExcute(query, filters);

		return query.desc("createTime").list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals(EvaluatePO.COLUMN_SCORE_STR)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if (field.equals(EvaluatePO.COLUMN_UNIONID_STR)) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals(MgoodsPO.COLUMN_GID_STR)) {
				query.add(query.getCriterion(field, Long.valueOf(data), op));
			}
		}
	}

}
