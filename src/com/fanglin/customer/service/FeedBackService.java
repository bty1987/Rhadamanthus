package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.FeedBackVO;
import com.fanglin.utils.Paging;

public interface FeedBackService {
	
	public void pageFeedback(Paging paging,List<Filter> filters);

	public int addFeedBack(FeedBackVO feedBackVO) throws FLException;
	
}
