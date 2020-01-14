package com.fanglin.production.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.production.dao.ProductionSalesDao;
import com.fanglin.production.po.ProductionSalesPO;

@Repository("productionsalesDao")
public class ProductionSalesDaoImpl extends DaoImpl<ProductionSalesPO> implements ProductionSalesDao {

	public ProductionSalesDaoImpl() {
		super(ProductionSalesPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProductionSalesPO> queryProductionSalesByPid(long pid) {
		return (List<ProductionSalesPO>) createCriteria(ProductionSalesPO.class).add(Restrictions.eq(ProductionSalesPO.COLUMN_PID_STR, pid)).list();
	}

	@Override
	public int countProductionSalesByPidASid(Long pid, Long sid) {
		String sql = "select count(*) from production.productionsales where pid = :pid and sid = :sid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("pid", pid).setLong("sid", sid).uniqueResult();
		return  count.intValue();
	}

}
