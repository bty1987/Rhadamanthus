package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.FeedbackVO;
import com.fanglin.utils.Paging;

public interface FeedbackService {
	
	public void pageFeedback(Paging paging,List<Filter> filters, int company);

	public int addFeedback(FeedbackVO feedbackVO) throws FLException;
	
}
