package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationLabelPO;
import com.fanglin.data.quotation.dao.QuotationLabelDao;
import com.fanglin.utils.Paging;

@Repository("quotationLabelDao")
public class QuotationLablelDaoImpl extends DaoImpl<QuotationLabelPO> implements QuotationLabelDao {

	public QuotationLablelDaoImpl() {
		super(QuotationLabelPO.class);
	}

	@Override
	public List<QuotationLabelPO> pageQuotationLabel(Paging paging, List<Filter> filters) {

		PagingQuery<QuotationLabelPO> query = pagingQuery(paging, QuotationLabelPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (QuotationLabelPO.COLUMN_NAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			}
		}
	}
}
