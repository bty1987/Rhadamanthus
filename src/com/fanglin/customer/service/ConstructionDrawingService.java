package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionDrawingService {
	
	public void queryCusConstructionDrawing(Paging paging, List<Filter> filters, Long cid, Short schedule);
	
}
