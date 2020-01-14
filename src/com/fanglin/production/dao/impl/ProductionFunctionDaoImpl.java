package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.production.dao.ProductionFunctionDao;
import com.fanglin.production.po.ProductionFunctionPO;

@Repository("productionFunctionDao")
public class ProductionFunctionDaoImpl extends DaoImpl<ProductionFunctionPO> implements ProductionFunctionDao {

	public ProductionFunctionDaoImpl (){
		super(ProductionFunctionPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ProductionFunctionPO> queryProductionFunction(Short type) {

		if(type != null){
			return session().createCriteria(ProductionFunctionPO.class).add(Restrictions.eq("type", type)).list();
		}else{
			return session().createCriteria(ProductionFunctionPO.class).list();
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProductionFunctionPO> queryProductionFunctionByName(String name) {
		return session().createCriteria(ProductionFunctionPO.class).add(Restrictions.eq("name", name)).list();
	}
	
}
