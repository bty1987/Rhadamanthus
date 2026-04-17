package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationProfileDao;
import com.fanglin.quotation.po.QuotationProfilePO;
import com.fanglin.utils.Paging;

@Repository("quotationProfileDao")
public class QuotationProfileDaoImpl extends DaoImpl<QuotationProfilePO> implements QuotationProfileDao {

	public QuotationProfileDaoImpl() {
		super(QuotationProfilePO.class);
	}

	@Override
	public List<QuotationProfilePO> pageQuotationProfile(Paging paging, List<Filter> filters, int company) {

		PagingQuery<QuotationProfilePO> query = pagingQuery(paging, QuotationProfilePO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExecute(query, filters);

		query.desc("qpid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationProfilePO> queryQuotationProfileByQid(long qid, Short type) {

		Criteria query = session().createCriteria(QuotationProfilePO.class).add(Restrictions.eq("qid", qid));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationProfilePO> queryQuotationProfileByOrderId(String orderId, Short type) {

		Criteria query = session().createCriteria(QuotationProfilePO.class).add(Restrictions.eq("orderId", orderId));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		return query.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("orderId".equals(field)) {
				query.add(query.getCriterion("orderId", data, op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			}
		}
	}

}
