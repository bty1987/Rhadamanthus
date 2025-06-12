package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.FeedbackComplaintDao;
import com.fanglin.customer.po.FeedbackComplaintPO;

@Repository("feedbackComplaintDao")
public class FeedbackComplaintDaoImpl extends DaoImpl<FeedbackComplaintPO> implements FeedbackComplaintDao {

	public FeedbackComplaintDaoImpl() {
		super(FeedbackComplaintPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FeedbackComplaintPO> queryFeedbackComplaint(long fid) {

		return session().createCriteria(FeedbackComplaintPO.class).add(Restrictions.eq("fid", fid)).list();
	}
}
