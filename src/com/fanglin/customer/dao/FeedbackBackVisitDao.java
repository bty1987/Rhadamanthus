package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.FeedbackBackVisitPO;

public interface FeedbackBackVisitDao extends Dao<FeedbackBackVisitPO> {

	public List<FeedbackBackVisitPO> queryFeedbackBackVisit(long fid);

}
