package com.fanglin.payment.dao;

import java.util.List;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.utils.Paging;

public interface SalesPaymentDao  extends Dao<SalesPaymentPO>{

	public List<SalesPaymentPO> pageSalesPaymentForInit(Paging paging, List<Filter> filters);
	
	public List<SalesPaymentPO> pageSalesPaymentForCollect(Paging paging, List<Filter> filters);
	
	public List<SalesPaymentPO> pageSalesPaymentForConfirm(Paging paging, List<Filter> filters);
	
	public List<SalesPaymentPO> pageSalesPaymentForNotInit(Paging paging, List<Filter> filters);
	
	public List<SalesPaymentPO> querySalesPaymentsBySid(long sid);
	
	public List<SalesPaymentPO> querySalesPaymentForNotInitBySrid(long srid);
	
	public List<SalesPaymentPO> querySalesPaymentBySids(List<Long> sids);
	
	public int countSalesPaymentBySidAType(Long sid,Short type);
	
	public int countSalesPaymentBySid(long sid);
	
}
