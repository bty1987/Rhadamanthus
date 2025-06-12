package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.customer.vo.FeedbackComplaintDeptVO;

public interface FeedbackComplaintDeptService {

	public List<FeedbackComplaintDeptVO> queryFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept);

	public long addFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept, Authentication authentication) throws FLException;

	public int updateFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept);

	public void deleteFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept) throws FLException;

}
