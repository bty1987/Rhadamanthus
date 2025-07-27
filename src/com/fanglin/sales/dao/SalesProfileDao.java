package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesProfilePO;
import com.fanglin.utils.Paging;

public interface SalesProfileDao extends Dao<SalesProfilePO> {

	public List<SalesProfilePO> pageSalesProfile(Paging paging, List<Filter> filters, int company);

	public SalesProfilePO querySalesProfileByOrderId(String orderId);

}
