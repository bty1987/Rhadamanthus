package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.PointPaymentDao;
import com.fanglin.customer.po.PointPaymentPO;

@Repository("pointPaymentDao")
public class PointPaymentDaoImpl extends DaoImpl<PointPaymentPO> implements PointPaymentDao {

	public PointPaymentDaoImpl() {
		super(PointPaymentPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PointPaymentPO> queryPointPaymentByOrderId(String orderId) {
		return session().createCriteria(PointPaymentPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("status", PointPaymentPO.STATUS_ABLE_SHORT)).list();
	}

	@Override
	public void updatePointPaymentByNo(String pointOrderId) {
		String sql = "update customer.cppointpayment set status = :status where no = :no";

		session().createSQLQuery(sql).setString("no", pointOrderId).setLong("status", PointPaymentPO.STATUS_DISABLE_SHORT).executeUpdate();

	}
}
