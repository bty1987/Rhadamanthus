package com.fanglin.communion.dao.impl;

import java.math.BigInteger;
import java.util.List;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.core.dao.impl.DaoImpl;

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
	
	@Override
	public int clearCustomerPhoneForDefault(Long cid){
		
		String sql = "update communion.customerphone c set c.defaults = 0 where c.cid = :cid";
		
		return session().createSQLQuery(sql).setLong("cid", cid).executeUpdate();
		 
	}
	
}
