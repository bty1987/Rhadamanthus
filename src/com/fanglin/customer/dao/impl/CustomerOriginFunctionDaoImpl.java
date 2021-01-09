package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerOriginFunctionDao;
import com.fanglin.customer.po.CustomerOriginFunctionPO;

@Repository("customerOriginFunctionDao")
public class CustomerOriginFunctionDaoImpl extends DaoImpl<CustomerOriginFunctionPO> implements CustomerOriginFunctionDao {

	public CustomerOriginFunctionDaoImpl(){
		super(CustomerOriginFunctionPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerOriginFunctionPO> queryCustomerOriginFunction(Short type) {
		
		Criteria criteria = session().createCriteria(CustomerOriginFunctionPO.class).add(Restrictions.eq("status", CustomerOriginFunctionPO.STATUS_ENABLE_INT));
		
		if(type != null){
			criteria.add(Restrictions.eq("type", type));
		}
		
		return criteria.list();
	}

}
