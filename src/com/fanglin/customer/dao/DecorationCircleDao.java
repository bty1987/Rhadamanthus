package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.DecorationCirclePO;
import com.fanglin.utils.Paging;

public interface DecorationCircleDao extends Dao<DecorationCirclePO>{
	
	public List<DecorationCirclePO> queryDecorationCircleByOrderIds(Paging paging, List<Filter> filters, List<String> orderIds);
	
	public List<DecorationCirclePO> queryDecorationCircleByOrderId(Paging paging, List<Filter> filters, String orderId);
	
}
