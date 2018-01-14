package com.fanglin.production.dao.impl;


import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;

import com.fanglin.production.dao.ProductionSalesDao;

import com.fanglin.production.po.ProductionSalesPO;

@Repository("productionsalesDao")
public class ProductionSalesDaoImpl extends DaoImpl<ProductionSalesPO> implements ProductionSalesDao {

	public ProductionSalesDaoImpl(){
		super(ProductionSalesPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<ProductionSalesPO> queryProductionSalesByPid(long pid) {
		
		return (List<ProductionSalesPO>) createCriteria(ProductionSalesPO.class).add(Restrictions.eq(ProductionSalesPO.COLUMN_PID_STR, pid)).list();
		
	}

}
