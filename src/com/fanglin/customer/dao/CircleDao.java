package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CirclePO;
import com.fanglin.utils.Paging;

public interface CircleDao extends Dao<CirclePO>{
	
	public List<CirclePO> queryDecorationCircleByOrderIds(Paging paging, List<Filter> filters, List<String> orderIds);
	
	public List<CirclePO> queryDecorationCircleByOrderId(Paging paging, List<Filter> filters, String orderId);
	
}
