package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.CustomerSourceRightDao;
import com.fanglin.right.po.CustomerSourceRightPO;

@Repository("customerSourceRightDao")
public class CustomerSourceRightDaoImpl extends DaoImpl<CustomerSourceRightPO> implements CustomerSourceRightDao {

	public CustomerSourceRightDaoImpl(){
		super(CustomerSourceRightPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<CustomerSourceRightPO> queryCustomerSourceRightByUserId(int uid, int company) {

		return session().createCriteria(CustomerSourceRightPO.class).add(Restrictions.eq(CustomerSourceRightPO.COLUMN_UID_STR, uid)).add(Restrictions.eq(CustomerSourceRightPO.COLUMN_COMPANY_STR, company)).list();
	
	}

	@Override
	public void deleteCustomerSourceRightByUid(int uid, int company) {
		
		String sql="delete from platform.customersourceright where uid=:uid and company=:company";
		
		session().createSQLQuery(sql).setLong("uid", uid).setInteger("company", company).executeUpdate();
	}

}
