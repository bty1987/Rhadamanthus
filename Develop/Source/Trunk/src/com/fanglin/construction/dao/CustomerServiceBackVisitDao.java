/**
 * @File Name		: CustomerServiceBackVisitDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.CustomerServiceBackVisitPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CustomerServiceBackVisitDao extends Dao<CustomerServiceBackVisitPO> {
	
	public List<CustomerServiceBackVisitPO> pageCustomerServiceBackVisit(Paging paging, List<Filter> filters);
	
	public List<CustomerServiceBackVisitPO> pageCustomerServiceBackVisitByOrderId(Paging paging, List<Filter> filters, String orderId);

}
