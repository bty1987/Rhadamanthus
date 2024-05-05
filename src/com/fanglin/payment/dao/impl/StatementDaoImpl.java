package com.fanglin.payment.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.StatementDao;
import com.fanglin.payment.po.StatementPO;
import com.fanglin.utils.Paging;

@Repository("statementDao")
public class StatementDaoImpl extends DaoImpl<StatementPO> implements StatementDao {

	public StatementDaoImpl() {
		super(StatementPO.class);
	}

	@Override
	public List<StatementPO> pageStatement(Paging paging, List<Filter> filters) {

		PagingQuery<StatementPO> query = pagingQuery(paging, StatementPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null && filters.size() > 0) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if (StatementPO.COLUMN_CUSTNO_STR.equals(field)) {
					query.add(query.getCriterion(StatementPO.COLUMN_CUSTNO_STR, data, op));
				} else if (StatementPO.COLUMN_ORDERNO_STR.equals(field)) {
					query.add(query.getCriterion(StatementPO.COLUMN_ORDERNO_STR, data, op));
				} else if (StatementPO.COLUMN_TYPE_STR.equals(field)) {
					query.add(query.getCriterion(StatementPO.COLUMN_TYPE_STR, Short.valueOf(data), op));
				} else if (StatementPO.COLUMN_STATUS_STR.equals(field)) {
					query.add(query.getCriterion(StatementPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
				} else if (StatementPO.COLUMN_CREATETIME_STR.equals(field) && "between".equals(op)) {
					query.timeranges(StatementPO.COLUMN_CREATETIME_STR, StatementPO.COLUMN_CREATETIME_STR, data);
				} else if (StatementPO.COLUMN_PAYTIME_STR.equals(field) && "between".equals(op)) {
					query.timeranges(StatementPO.COLUMN_PAYTIME_STR, StatementPO.COLUMN_PAYTIME_STR, data);
				}
			}
		}
	}
}
