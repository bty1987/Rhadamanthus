package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.FeedbackVO;
import com.fanglin.utils.Paging;

public interface FeedbackService {

	public void pageFeedback(Paging paging, List<Filter> filters, int company) throws FLException;

	public void pageFeedbackByOrderId(Paging paging, List<Filter> filters) throws FLException;

	public int addFeedback(FeedbackVO feedbackVO) throws FLException;

	public int receiveFeedback(FeedbackVO feedback, Authentication authentication) throws FLException;

	public int finishFeedback(FeedbackVO feedback, Authentication authentication) throws FLException;

}
