package com.fanglin.production.dao.impl;

import java.math.BigInteger;
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
	public int queryProductionWorkPlanByPpidAWpid(long ppid, long wpid) {
		String sql = "select count(*) from production.productionworkplan where ppid = :ppid and wpid = :wpid and status != :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("ppid", ppid).setLong("wpid", wpid).setShort("status", ProductionWorkPlanPO.STATUS_INVALID_INT).uniqueResult();
		return count.intValue();
	}

	@Override
	public int countProductionWorkPlanByPpid(long ppid) {
		String sql = "select count(*) from production.productionworkplan where ppid = :ppid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("ppid", ppid).uniqueResult();
		return count.intValue();
	}
	
	@Override
	public int countProductionWorkPlanByPpidAStatus(Long ppid, Short sort, Short status) {
		String sql = "select count(*) from production.productionworkplan where ppid = :ppid and sort < :sort and status < :status ";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("ppid", ppid).setShort("sort", sort).setShort("status", status).uniqueResult();
		return count.intValue();
	}		

}


