package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.RepairDao;
import com.fanglin.customer.po.RepairPO;

@Repository("repairDao")
public class RepairDaoImpl extends DaoImpl<RepairPO> implements RepairDao {
	
	public RepairDaoImpl(){
		super(RepairPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<RepairPO> queryRepair(long aid) {
		return session().createCriteria(RepairPO.class).add(Restrictions.eq("aid", aid)).list();
	}

}
