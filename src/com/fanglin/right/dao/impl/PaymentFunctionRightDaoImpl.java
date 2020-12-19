package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.PaymentFunctionRightDao;
import com.fanglin.right.po.PaymentFunctionRightPO;

@Repository("paymentFunctionRightDao")
public class PaymentFunctionRightDaoImpl extends DaoImpl<PaymentFunctionRightPO> implements PaymentFunctionRightDao {
	
	public PaymentFunctionRightDaoImpl(){
		super(PaymentFunctionRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentFunctionRightPO> queryPaymentFunctionRight(String name, Short type) {
		return session().createCriteria(PaymentFunctionRightPO.class).add(Restrictions.eq("name", name)).add(Restrictions.eq("type", type)).list();
	}

	@Override
	public int deletePaymentFunctionRightByName(String name, Short type) {
		
		String sql = "delete from platform.paymentfunctionright where name = :name and type = :type";
		session().createSQLQuery(sql).setString("name", name).setShort("type", type).executeUpdate();
		
		return 0;
	}
	
	

}
