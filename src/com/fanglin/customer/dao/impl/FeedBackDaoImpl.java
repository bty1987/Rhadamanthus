package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.FeedbackDao;
import com.fanglin.customer.po.FeedbackPO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Paging;

@Repository("feedbackDao")
public class FeedbackDaoImpl extends DaoImpl<FeedbackPO> implements FeedbackDao {

	public FeedbackDaoImpl() {
		super(FeedbackPO.class);
	}

	@Override
	public List<FeedbackPO> pageFeedback(Paging paging, List<Filter> filters, int company) {

		PagingQuery<FeedbackPO> query = pagingQuery(paging, FeedbackPO.class);

		if (company != CompanyPO.TYPE_HEADQUARTER_INT) {
			query.alias("company", "company").add(Restrictions.eq("company.cid", company));
		}

		queryFilterExcute(query, filters);

		query.desc("fid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<FeedbackPO> query, List<Filter> filters) {

		if (filters == null) {
			return;
		}

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("orderId".equals(field)) {
				query.add(query.getCriterion(FeedbackPO.COLUMN_ORDERID_STR, data, op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion(FeedbackPO.COLUMN_TYPE_STR, Short.valueOf(data), op));
			} else if ("phone".equals(field)) {
				query.add(query.getCriterion(FeedbackPO.COLUMN_PHONE_STR, data, op));
			} else if ("createTime".equals(filter.getField())) {
				query.timeranges("createTime", "createTime", data);
			}
		}
	}

}
