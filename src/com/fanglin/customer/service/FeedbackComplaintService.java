package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.customer.vo.FeedbackComplaintVO;

public interface FeedbackComplaintService {

	public List<FeedbackComplaintVO> queryFeedbackComplaint(FeedbackComplaintVO feedbackComplaint);

	public long addFeedbackComplaint(FeedbackComplaintVO feedbackComplaint, Authentication authentication) throws FLException;

	public int finishFeedbackComplaint(FeedbackComplaintVO feedbackComplaint, Authentication authentication) throws FLException;

	public void updateFeedbackComplaint(FeedbackComplaintVO feedbackComplaint);

}
