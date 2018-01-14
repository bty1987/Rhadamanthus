package com.fanglin.data.common.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.CustomerPhoneDao;
import com.fanglin.data.po.CustomerPhonePO;

@Repository("customerPhoneDao")
public class CustomerPhoneDaoImpl extends DaoImpl<CustomerPhonePO> implements CustomerPhoneDao {

	public CustomerPhoneDaoImpl(){
		super(CustomerPhonePO.class);
	}
	@Override
	 public  int countCustomerPhone(String phone){
		
		String sql = "select count(*) from communion.customerphone where phone  =:phone";
	    
		BigInteger count = (BigInteger)session().createSQLQuery(sql).setString("phone", phone).uniqueResult();

	    return count.intValue();
	 }
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerPhonePO> queryCustomerPhoneByCid(Long cid, Short status){
		
		Criteria query = session().createCriteria(CustomerPhonePO.class).add(Restrictions.eq("cid", cid));
		
		if(status != null){
			query.add(Restrictions.eq(CustomerPhonePO.COLUMN_STATUS_STR, status));
		}
		
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<CustomerPhonePO> queryCustomerPhoneByPhone(String phone,Short status){
			
		Criteria query = session().createCriteria(CustomerPhonePO.class).add(Restrictions.eq("phone", phone));
	
		if(status != null){
			query.add(Restrictions.eq(CustomerPhonePO.COLUMN_STATUS_STR, status));
		}
		
		return query.list();
	}
	
	@Override
	public CustomerPhonePO queryCustomerPhone(Long cid, String phone){
		return  (CustomerPhonePO) session().createCriteria(CustomerPhonePO.class).add(Restrictions.eq("phone", phone)).add(Restrictions.eq("cid", cid)).uniqueResult();
	}
	
}
