package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.RepairpayDao;
import com.fanglin.customer.po.RepairpayPO;

@Repository("repairpayDao")
public class RepairpayDaoImpl extends DaoImpl<RepairpayPO> implements RepairpayDao {

	public RepairpayDaoImpl() {
		super(RepairpayPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RepairpayPO> queryRepairpay(long aid) {
		return session().createCriteria(RepairpayPO.class).add(Restrictions.eq("aid", aid)).list();
	}

}
