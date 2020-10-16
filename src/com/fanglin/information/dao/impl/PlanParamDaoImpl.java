package com.fanglin.information.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.information.dao.PlanParamDao;
import com.fanglin.information.po.PlanParamPO;

@Repository("planParamDao")
public class PlanParamDaoImpl extends DaoImpl<PlanParamPO> implements PlanParamDao{

	@Override
	public PlanParamPO queryPlanParam(Long pid) {
		
		return (PlanParamPO) session().createCriteria(PlanParamPO.class).add(Restrictions.eq("pid", pid)).uniqueResult();
	}

}
