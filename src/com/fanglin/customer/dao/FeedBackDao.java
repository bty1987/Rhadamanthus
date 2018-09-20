package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.FeedbackPO;
import com.fanglin.utils.Paging;

public interface FeedBackDao extends Dao<FeedbackPO>{
	
	public List<FeedbackPO> pageFeedback(Paging paging, List<Filter> filters);
	
}
