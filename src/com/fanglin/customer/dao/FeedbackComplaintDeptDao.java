package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.FeedbackComplaintDeptPO;

public interface FeedbackComplaintDeptDao extends Dao<FeedbackComplaintDeptPO> {

	public List<FeedbackComplaintDeptPO> queryFeedbackComplaintDept(long fcid);

}
