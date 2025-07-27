package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.customer.vo.FeedbackComplaintDeptVO;

public interface FeedbackComplaintDeptService {

	public List<FeedbackComplaintDeptVO> queryFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept);

	public int addFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept, Authentication authentication) throws FLException;

	public int updateFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept);

	public int deleteFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept) throws FLException;

}
