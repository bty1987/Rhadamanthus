package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CppointPaymentDao;
import com.fanglin.customer.po.CppointPaymentPO;

@Repository("CppointPaymentDao")
public class CppointPaymentDaoImpl extends DaoImpl<CppointPaymentPO> implements CppointPaymentDao {

	public CppointPaymentDaoImpl() {
		super(CppointPaymentPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CppointPaymentPO> queryCppointPaymentByOrderId(String orderId) {
		return session().createCriteria(CppointPaymentPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("status", CppointPaymentPO.STATUS_ABLE_SHORT)).list();
	}

	@Override
	public void updateCppointPaymentByNo(String pointOrderId) {
		String sql = "update customer.cppointpayment set status = :status where no = :no";

		session().createSQLQuery(sql).setString("no", pointOrderId).setLong("status", CppointPaymentPO.STATUS_DISABLE_SHORT).executeUpdate();
		
	}
}
