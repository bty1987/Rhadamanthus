package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.FeedbackComplaintPO;

public interface FeedbackComplaintDao extends Dao<FeedbackComplaintPO> {

	public List<FeedbackComplaintPO> queryFeedbackComplaint(long fid);

}
