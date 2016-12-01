/**
 * @File Name		: CustomerServiceComplaintDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.CustomerServiceComplaintDao;
import com.fanglin.construction.po.CustomerServiceComplaintPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("customerServiceComplaintDao")
public class CustomerServiceComplaintDaoImpl extends DaoImpl<CustomerServiceComplaintPO> implements CustomerServiceComplaintDao {

	public CustomerServiceComplaintDaoImpl(){
		super(CustomerServiceComplaintPO.class);
	}

	@Override
	public List<CustomerServiceComplaintPO> pageCustomerServiceComplaint(Paging paging, List<Filter> filters){
		
		PagingQuery<CustomerServiceComplaintPO> query = pagingQuery(paging, CustomerServiceComplaintPO.class);
		
		if(filters != null){
			for(Filter filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

	@Override
	public List<CustomerServiceComplaintPO> pageCustomerServiceComplaintByOrderId(Paging paging, List<Filter> filters, String orderId){
		
		PagingQuery<CustomerServiceComplaintPO> query = pagingQuery(paging, CustomerServiceComplaintPO.class);
		
		query.add(query.getCriterion(CustomerServiceComplaintPO.COLUMN_ORDERID_STR, orderId, "eq"));
		
		if(filters != null){
			for(Filter filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

}
