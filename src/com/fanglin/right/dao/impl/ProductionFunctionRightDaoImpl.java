package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.ProductionFunctionRightDao;
import com.fanglin.right.po.ProductionFunctionRightPO;

@Repository("productionFunctionRightDao")
public class ProductionFunctionRightDaoImpl extends DaoImpl<ProductionFunctionRightPO> implements ProductionFunctionRightDao{

	public ProductionFunctionRightDaoImpl() {
		super(ProductionFunctionRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProductionFunctionRightPO> queryProductionFunctionRightByName(String name) {
		return session().createCriteria(ProductionFunctionRightPO.class).add(Restrictions.eq("name",name)).list();
	}

	@Override
	public int deleteProductionFunctionRightByName(String name) {
		String sql = "delete from platform.productionfunctionright where name = :name";
		session().createSQLQuery(sql).setString("name", name).executeUpdate();
		return 0;
	}

	
}
