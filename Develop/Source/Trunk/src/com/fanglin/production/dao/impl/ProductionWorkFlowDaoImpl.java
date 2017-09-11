package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.production.dao.ProductionWorkFlowDao;
import com.fanglin.production.po.ProductionWorkFlowPO;

@Repository("ProductionWorkFlowDao")
public class ProductionWorkFlowDaoImpl extends DaoImpl<ProductionWorkFlowPO> implements ProductionWorkFlowDao {
	
	public ProductionWorkFlowDaoImpl(){
		super(ProductionWorkFlowPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ProductionWorkFlowPO> queryProductionWorkFlowByPwpid(long pwpid) {
		return session().createCriteria(ProductionWorkFlowPO.class)
				.add(Restrictions.eq(ProductionWorkFlowPO.COLUMN_PWPID_STR, pwpid)).list();
	}

	@Override
	public ProductionWorkFlowPO queryProductionWorkFlowByPwpidAWfid(long pwpid,
			long wfid) {
		
		return (ProductionWorkFlowPO) session().createCriteria(ProductionWorkFlowPO.class)
				.add(Restrictions.eq(ProductionWorkFlowPO.COLUMN_PWPID_STR, pwpid))
				.add(Restrictions.eq(ProductionWorkFlowPO.COLUMN_WORKFLOW_STR, wfid)).uniqueResult();
	}
	
}
