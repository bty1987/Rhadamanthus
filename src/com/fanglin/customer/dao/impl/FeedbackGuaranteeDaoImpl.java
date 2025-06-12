package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.FeedbackGuaranteeDao;
import com.fanglin.customer.po.FeedbackGuaranteePO;


@Repository("feedbackGuaranteeDao")
public class FeedbackGuaranteeDaoImpl extends DaoImpl<FeedbackGuaranteePO> implements FeedbackGuaranteeDao {

	public FeedbackGuaranteeDaoImpl() {
		super(FeedbackGuaranteePO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<FeedbackGuaranteePO> queryFeedbackGuarantee(long fid) {
		
		return session().createCriteria(FeedbackGuaranteePO.class).add(Restrictions.eq("fid", fid)).list();

	}



}
