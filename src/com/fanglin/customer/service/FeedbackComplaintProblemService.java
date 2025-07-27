package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.customer.vo.FeedbackComplaintProblemVO;

public interface FeedbackComplaintProblemService {

	public List<FeedbackComplaintProblemVO> queryFeedbackComplaintProblem(List<Long> deptTypes);

}
