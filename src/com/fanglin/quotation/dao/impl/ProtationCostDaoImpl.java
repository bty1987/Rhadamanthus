package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.ProtationCostDao;
import com.fanglin.quotation.po.ProtationCostPO;

@Repository("protationCostDao")
public class ProtationCostDaoImpl extends DaoImpl<ProtationCostPO> implements ProtationCostDao {

	public ProtationCostDaoImpl(){
		super(ProtationCostPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ProtationCostPO> queryProtationCost(Long pid) {
		return session().createCriteria(ProtationCostPO.class).add(Restrictions.eq("pid", pid)).list();
	}

}
