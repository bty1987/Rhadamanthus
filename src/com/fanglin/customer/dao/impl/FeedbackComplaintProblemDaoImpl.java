package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.FeedbackComplaintProblemDao;
import com.fanglin.customer.po.FeedbackComplaintProblemPO;

@Repository("FeedbackComplaintProblemDao")
public class FeedbackComplaintProblemDaoImpl extends DaoImpl<FeedbackComplaintProblemPO> implements FeedbackComplaintProblemDao {

	public FeedbackComplaintProblemDaoImpl() {
		super(FeedbackComplaintProblemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FeedbackComplaintProblemPO> queryFeedbackComplaintProblem(List<Long> deptTypes) {
		return session().createCriteria(FeedbackComplaintProblemPO.class).add(Restrictions.in("parentId", deptTypes)).list();
	}

}
