package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.FeedbackDao;
import com.fanglin.customer.po.FeedbackPO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Repository("feedbackDao")
public class FeedbackDaoImpl extends DaoImpl<FeedbackPO> implements FeedbackDao {

	public FeedbackDaoImpl() {
		super(FeedbackPO.class);
	}

	@Override
	public List<FeedbackPO> pageFeedback(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<FeedbackPO> query = pagingQuery(paging, FeedbackPO.class);

		if (company != CompanyPO.TYPE_HEADQUARTER_INT) {
			query.alias("company", "company").add(Restrictions.eq("company.cid", company));
		}

		queryFilterExcute(query, filters);

		query.desc("fid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<FeedbackPO> query, List<Filter> filters) throws FLException {

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
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("company".equals(field) && FormatUtil.decodeCompany(data) == CompanyPO.TYPE_HEADQUARTER_INT) {
				query.alias("company", "company").add(query.getCriterion("company.cid", FormatUtil.decodeCompany(data), op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(FeedbackPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
			} else if ("handleTime".equals(field)) {
				query.timeranges("handleTime", "handleTime", data);
			} else if ("receiveTime".equals(field)) {
				query.timeranges("receiveTime", "receiveTime", data);
			} else if ("handler".equals(field)) {
				query.alias("handler", "handler");
				query.add(query.getCriterion(FeedbackPO.COLUMN_HANDLER_STR, data, op));
			} else if ("receiver".equals(field)) {
				query.alias("receiver", "receiver");
				query.add(query.getCriterion(FeedbackPO.COLUMN_RECEIVER_STR, data, op));
			}
		}
	}

}
