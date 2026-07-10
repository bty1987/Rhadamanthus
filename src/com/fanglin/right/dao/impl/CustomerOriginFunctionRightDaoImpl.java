package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.CustomerOriginFunctionRightDao;
import com.fanglin.right.po.CustomerOriginFunctionRightPO;

@Repository("customerOriginFunctionRightDao")
public class CustomerOriginFunctionRightDaoImpl extends DaoImpl<CustomerOriginFunctionRightPO> implements CustomerOriginFunctionRightDao {
	
	public CustomerOriginFunctionRightDaoImpl(){
		super(CustomerOriginFunctionRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerOriginFunctionRightPO> queryCustomerOriginFunctionRight(String name, Integer company) {
		return session().createCriteria(CustomerOriginFunctionRightPO.class).add(Restrictions.eq("name", name)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	public int deleteCustomerOriginFunctionRightByName(String name, Integer company) {

		String sql = "delete from platform.customerOriginfunctionright where name = :name and company = :company";
		session().createSQLQuery(sql).setString("name", name).setInteger("company", company).executeUpdate();

		return 0;
	}
	
	

}
