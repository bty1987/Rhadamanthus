package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesRefundsPO;
import com.fanglin.utils.Paging;

public interface SalesRefundsDao extends Dao<SalesRefundsPO> {

	public List<SalesRefundsPO> pageSalesRefunds(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<SalesRefundsPO> querySalesRefundsBySid(Long sid);

	public void updateSalesRefundsForStatusBySpid(Long spid, short status);

}
