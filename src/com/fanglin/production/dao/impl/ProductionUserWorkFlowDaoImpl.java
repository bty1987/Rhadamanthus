package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.production.dao.ProductionUserWorkFlowDao;
import com.fanglin.production.po.ProductionUserWorkFlowPO;

@Repository("ProductionUserWorkFlowDao")
public class ProductionUserWorkFlowDaoImpl extends DaoImpl<ProductionUserWorkFlowPO> implements ProductionUserWorkFlowDao {
	
	public ProductionUserWorkFlowDaoImpl(){
		super(ProductionUserWorkFlowPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProductionUserWorkFlowPO> queryProductionUserWorkFlowByPwfid(long pwfid) {
		return session().createCriteria(ProductionUserWorkFlowPO.class).add(Restrictions.eq("productionworkflow.pwfid", pwfid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProductionUserWorkFlowPO> queryProductionUserWorkFlowByPwfids(List<Long> pwfids) {
		return session().createCriteria(ProductionUserWorkFlowPO.class).add(Restrictions.in("productionworkflow.pwfid", pwfids)).list();
	}

}
