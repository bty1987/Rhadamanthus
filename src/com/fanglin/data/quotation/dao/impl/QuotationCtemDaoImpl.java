package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationCtemPO;
import com.fanglin.data.quotation.dao.QuotationCtemDao;
import com.fanglin.utils.Paging;

@Repository("quotationCtemDao")
public class QuotationCtemDaoImpl extends DaoImpl<QuotationCtemPO> implements QuotationCtemDao {

	public QuotationCtemDaoImpl() {
		super(QuotationCtemPO.class);
	}

	@Override
	public List<QuotationCtemPO> pageQuotationCtem(Paging paging, List<Filter> filters) {

		PagingQuery<QuotationCtemPO> query = pagingQuery(paging, QuotationCtemPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<QuotationCtemPO> queryQuotationCtem(Paging paging, String name) {

		PagingQuery<QuotationCtemPO> query = pagingQuery(paging, QuotationCtemPO.class);

		query.add(Restrictions.eq(QuotationCtemPO.COLUMN_STATUS_STR, QuotationCtemPO.STATUS_ENABLE_INT)).add(Restrictions.or(Restrictions.like(QuotationCtemPO.COLUMN_NAME_STR, name, MatchMode.ANYWHERE), Restrictions.like(QuotationCtemPO.COLUMN_PINYIN_STR, name, MatchMode.ANYWHERE)));

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("qcid".equals(field)) {
				query.add(query.getCriterion("qcid", Long.valueOf(data), op));
			}

		}
	}
}
