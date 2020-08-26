package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.AepairPO;
import com.fanglin.utils.Paging;

public interface AepairDao extends Dao<AepairPO> {

	public List<AepairPO> pageAepair(Paging paging,List<Filter> filters, int company);
	
	public List<AepairPO> queryAepair(long csid);
	
	public List<AepairPO> queryAepairByOrderId(String orderId);
}
