package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface DecorationPictureService {
	
	public void queryCusDecorationPicture(Paging paging, List<Filter> filters,String orderId,String unionId);
	
}
