package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationRecordDao;
import com.fanglin.quotation.po.QuotationRecordPO;
import com.fanglin.utils.Paging;

@Repository("quotationRecordDao")
public class QuotationRecordDaoImpl extends DaoImpl<QuotationRecordPO> implements QuotationRecordDao {

	public QuotationRecordDaoImpl() {
		super(QuotationRecordPO.class);
	}

	@Override
	public List<QuotationRecordPO> pageQuotationRecord(Paging paging, List<Filter> filters, Short type, Long qid) {

		PagingQuery<QuotationRecordPO> query = pagingQuery(paging, QuotationRecordPO.class);

		query.add(Restrictions.eq("type", type));
		query.add(Restrictions.eq("qid", qid));

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("operatTime".equals(field)) {
				query.timeranges("operatTime", "operatTime", data);
			}
		}
	}
}
