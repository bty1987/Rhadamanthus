package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.PresignCostPO;
import com.fanglin.data.quotation.dao.PresignCostDao;

@Repository("presignCostDao")
public class PresignCostDaoImpl extends DaoImpl<PresignCostPO> implements PresignCostDao {

	public PresignCostDaoImpl(){
		super(PresignCostPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PresignCostPO> queryPresignCost(Long ppid) {
		return session().createCriteria(PresignCostPO.class).add(Restrictions.eq("ppid", ppid)).list();
	}
}
