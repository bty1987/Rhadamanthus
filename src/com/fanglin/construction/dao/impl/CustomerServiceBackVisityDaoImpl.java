/**
 * @File Name	: CustomerServiceBackVisityDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.CustomerServiceBackVisitDao;
import com.fanglin.construction.po.CustomerServiceBackVisitPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("customerServiceBackVisitDao")
public class CustomerServiceBackVisityDaoImpl extends DaoImpl<CustomerServiceBackVisitPO> implements CustomerServiceBackVisitDao {

	public CustomerServiceBackVisityDaoImpl(){
		super(CustomerServiceBackVisitPO.class);
	}

	@Override
	public List<CustomerServiceBackVisitPO> pageCustomerServiceBackVisit(Paging paging, List<Filter> filters){
		
		PagingQuery<CustomerServiceBackVisitPO> query = pagingQuery(paging, CustomerServiceBackVisitPO.class);
		
		if(filters != null){
			for(Filter filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

	@Override
	public List<CustomerServiceBackVisitPO> pageCustomerServiceBackVisitByOrderId(Paging paging, List<Filter> filters, String orderId){
		
		PagingQuery<CustomerServiceBackVisitPO> query = pagingQuery(paging, CustomerServiceBackVisitPO.class);
		
		query.add(query.getCriterion(CustomerServiceBackVisitPO.COLUMN_ORDERID_STR, orderId, "eq"));
		
		if(filters != null){
			for(Filter filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

}
