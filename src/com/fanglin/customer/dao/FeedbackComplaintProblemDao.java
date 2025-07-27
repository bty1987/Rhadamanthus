package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.FeedbackComplaintProblemPO;

public interface FeedbackComplaintProblemDao extends Dao<FeedbackComplaintProblemPO> {

	List<FeedbackComplaintProblemPO> queryFeedbackComplaintProblem(List<Long> deptTypes);

}
