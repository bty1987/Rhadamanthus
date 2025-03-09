package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.FeedbackRecordDao;
import com.fanglin.customer.po.FeedbackRecordPO;
import com.fanglin.utils.Paging;

@Repository("feedbackRecordDao")
public class FeedbackRecordDaoImpl extends DaoImpl<FeedbackRecordPO> implements FeedbackRecordDao {

	public FeedbackRecordDaoImpl() {
		super(FeedbackRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FeedbackRecordPO> queryFeedbackRecord(long fid) {
		return session().createCriteria(FeedbackRecordPO.class).createAlias("feedback", "feedback").add(Restrictions.eq("feedback.fid", fid)).list();
	}
	
	@Override
	public List<FeedbackRecordPO> queryFeedbackRecordByfids(Paging paging,List<Long> fids) {
		
		PagingQuery<FeedbackRecordPO> query = pagingQuery(paging, FeedbackRecordPO.class);
		queryFilterExecute(query, fids);
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Long> fids) {
			query.add(query.getCriterion("feedback.fid", fids, "in"));
	}
}

