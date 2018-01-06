/**
 * Title: CustomerDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.data.common.dao.impl;

import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.utils.Paging;

@Repository("customerDao")
public class CustomerDaoImpl extends DaoImpl<CustomerPO> implements CustomerDao {

	public CustomerDaoImpl(){
		super(CustomerPO.class);
	}
	
	@Override
	public List<CustomerPO> pageCustomer(Paging paging, List<Filter> filters){

		PagingQuery<CustomerPO> query = pagingQuery(paging, CustomerPO.class);
		
		queryFilterExcute(query, filters);

		query.asc("cid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerPO> queryCustomerByPinyin(String pinyinName ){
		
		String sql="select * from communion.customer  where cid in (select cid from communion.customer  where name like '%"+pinyinName+"%'  or pinyinAll like '%"+pinyinName+"%'  or pinyinAB like '%"+pinyinName+"%')  or cid in (select cid from communion.customerphone   where phone like '%"+pinyinName+"%' and status = 0) limit 10" ;
	    
	    List<CustomerPO> customerPOs = session().createSQLQuery(sql).addEntity(CustomerPO.class).list();

		return customerPOs;
	}
	
	@Override
	public CustomerPO queryCustomerByNo(String no){
		return (CustomerPO) session().createCriteria(CustomerPO.class).add(Restrictions.eq("no", no)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			
			for(Filter filter : filters){
				if("customerName".equals(filter.getField())){
					query.add(query.getCriterion("customerName", filter));
				} else if("relationshipType".equals(filter.getField())){
					query.add(query.getCriterion("relationshipType", filter));
				}
			}
		}
	}

}
