package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationFunctionDao;
import com.fanglin.quotation.po.QuotationFunctionPO;
import com.fanglin.utils.Paging;

@Repository("quotationFunctionDao")
public class QuotationFunctionDaoImpl extends DaoImpl<QuotationFunctionPO> implements QuotationFunctionDao {

	public QuotationFunctionDaoImpl() {
		super(QuotationFunctionPO.class);
	}

	@Override
	public List<QuotationFunctionPO> pageQuotationFunction(Paging paging, List<Filter> filters) {
		PagingQuery<QuotationFunctionPO> query = pagingQuery(paging, QuotationFunctionPO.class);

		queryFilterExcute(query, filters);

		query.asc("sort").asc("qfid");

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
			} else if ("key".equals(field)) {
				query.add(query.getCriterion("key", data, op));
			} else if ("group".equals(field)) {
				query.add(query.getCriterion("group", data, op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", data, op));
			} else if ("subtype".equals(field)) {
				query.add(query.getCriterion("subtype", data, op));
			}
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationFunctionPO> queryQuotationFunction(Short type) {

		Criteria criteria = session().createCriteria(QuotationFunctionPO.class).add(Restrictions.eq("status", QuotationFunctionPO.STATUS_ENABLE_INT));

		if (type != null) {
			criteria.add(Restrictions.eq("type", type));
		}

		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationFunctionPO> queryQuotationFunctionByName(String name) {
		return session().createCriteria(QuotationFunctionPO.class).add(Restrictions.eq("name", name)).list();
	}

	@Override
	public long countQuotationFunctionRightByQfid(long qfid) {
		return ((Number) session().createQuery("select count(*) from QuotationFunctionRightPO where quotationFunction.qfid = :qfid").setParameter("qfid", qfid).uniqueResult()).longValue();
	}

}
