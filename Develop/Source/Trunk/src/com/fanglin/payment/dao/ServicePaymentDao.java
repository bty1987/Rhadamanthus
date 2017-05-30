package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.utils.Paging;

public interface ServicePaymentDao extends Dao<ServicePaymentPO>{

	public List<ServicePaymentPO> pageServicePaymentForCollect(Paging paging, List<Filter> filters);
	
	public List<ServicePaymentPO> pageServicePaymentForConfirm(Paging paging, List<Filter> filters);
	
	public List<ServicePaymentPO> pageServicePaymentForNotInit(Paging paging, List<Filter> filters);
	
}
