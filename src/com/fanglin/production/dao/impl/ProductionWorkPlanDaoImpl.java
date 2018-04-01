package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.production.dao.ProductionWorkPlanDao;
import com.fanglin.production.po.ProductionWorkPlanPO;

@Repository("ProductionWorkPlanDao")
public class ProductionWorkPlanDaoImpl extends DaoImpl<ProductionWorkPlanPO> implements ProductionWorkPlanDao {

	public ProductionWorkPlanDaoImpl() {
		super(ProductionWorkPlanPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProductionWorkPlanPO> queryProductionWorkPlanByPpid(long ppid) {
		return session().createCriteria(ProductionWorkPlanPO.class).add(Restrictions.eq(ProductionWorkPlanPO.COLUMN_PPID_STR, ppid)).list();
	}

	@Override
	public ProductionWorkPlanPO queryProductionWorkPlanByPpidAWpid(long ppid, long wpid) {

		return (ProductionWorkPlanPO) session().createCriteria(ProductionWorkPlanPO.class).add(Restrictions.eq(ProductionWorkPlanPO.COLUMN_PPID_STR, ppid)).add(Restrictions.eq(ProductionWorkPlanPO.COLUMN_WFID_STR, wpid)).uniqueResult();
	}

}
