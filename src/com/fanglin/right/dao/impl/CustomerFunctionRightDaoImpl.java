package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.CustomerFunctionRightDao;
import com.fanglin.right.po.CustomerFunctionRightPO;

@Repository("customerFunctionRightDao")
public class CustomerFunctionRightDaoImpl extends DaoImpl<CustomerFunctionRightPO> implements CustomerFunctionRightDao {
	
	public CustomerFunctionRightDaoImpl(){
		super(CustomerFunctionRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerFunctionRightPO> queryCustomerFunctionRight(String name, Integer company) {
		return session().createCriteria(CustomerFunctionRightPO.class).add(Restrictions.eq("name", name)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	public int deleteCustomerFunctionRightByName(String name, Integer company) {

		String sql = "delete from platform.customerOriginfunctionright where name = :name and company = :company";
		session().createSQLQuery(sql).setString("name", name).setInteger("company", company).executeUpdate();

		return 0;
	}
	
	

}
