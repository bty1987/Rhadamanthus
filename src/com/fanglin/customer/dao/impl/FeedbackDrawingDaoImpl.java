package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.FeedbackDrawingDao;
import com.fanglin.customer.po.FeedbackDrawingPO;

@Repository("feedbackDrawingDao")
public class FeedbackDrawingDaoImpl extends DaoImpl<FeedbackDrawingPO> implements FeedbackDrawingDao {

	public FeedbackDrawingDaoImpl() {
		super(FeedbackDrawingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FeedbackDrawingPO> queryFeedbackDrawing(long fid) {
		return session().createCriteria(FeedbackDrawingPO.class).add(Restrictions.eq("fid", fid)).add(Restrictions.eq(FeedbackDrawingPO.COLUMN_STATUS_STR, FeedbackDrawingPO.STATUS_INIT_SHORT)).list();
	}

}
