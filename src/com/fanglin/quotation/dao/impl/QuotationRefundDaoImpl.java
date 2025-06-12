package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationRefundDao;
import com.fanglin.quotation.po.QuotationRefundPO;
import com.fanglin.utils.Paging;

@Repository("quotationRefundDao")
public class QuotationRefundDaoImpl extends DaoImpl<QuotationRefundPO> implements QuotationRefundDao {

	public QuotationRefundDaoImpl(){
		super(QuotationRefundPO.class);
	}

	@Override
	public List<QuotationRefundPO> pageQuotationRefund(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<QuotationRefundPO> query = pagingQuery(paging, QuotationRefundPO.class);

		query.alias("decoration", "decoration");

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public QuotationRefundPO queryQuotationRefundByQid(long qid) {

		return (QuotationRefundPO) createCriteria(QuotationRefundPO.class).add(Restrictions.eq("quotation.qid", qid)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("orderId".equals(field)) {
				query.alias("decoration", "decoration");
				query.add(query.getCriterion("decoration.orderId", data, op));
			}
		}
	}

}
