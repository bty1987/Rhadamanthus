package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.FeedbackBackVisitDao;
import com.fanglin.customer.po.FeedbackBackVisitPO;

@Repository("feedbackBackVisitDao")
public class FeedbackBackVisitDaoImpl extends DaoImpl<FeedbackBackVisitPO> implements FeedbackBackVisitDao {

	public FeedbackBackVisitDaoImpl() {
		super(FeedbackBackVisitPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FeedbackBackVisitPO> queryFeedbackBackVisit(long fid) {
		return session().createCriteria(FeedbackBackVisitPO.class).add(Restrictions.eq("fid", fid)).list();
	}

}
