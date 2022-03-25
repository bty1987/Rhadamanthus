package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.FeedbackDrawingPO;

public interface FeedbackDrawingDao extends Dao<FeedbackDrawingPO> {

	public List<FeedbackDrawingPO> queryFeedbackDrawing(long fid);

}
