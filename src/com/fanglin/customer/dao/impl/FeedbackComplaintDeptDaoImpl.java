package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.FeedbackComplaintDeptDao;
import com.fanglin.customer.po.FeedbackComplaintDeptPO;

@Repository("feedbackComplaintDeptDao")
public class FeedbackComplaintDeptDaoImpl extends DaoImpl<FeedbackComplaintDeptPO> implements FeedbackComplaintDeptDao {

	public FeedbackComplaintDeptDaoImpl() {
		super(FeedbackComplaintDeptPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FeedbackComplaintDeptPO> queryFeedbackComplaintDept(long fcid) {

		return session().createCriteria(FeedbackComplaintDeptPO.class).add(Restrictions.eq("fcid", fcid)).list();
	}
}
