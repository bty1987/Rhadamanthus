package com.fanglin.sales.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesPurchaseDao;
import com.fanglin.sales.po.SalesPurchasePO;

@Repository("salesPurchaseDao")
public class SalesPurchaseDaoImpl extends DaoImpl<SalesPurchasePO> implements SalesPurchaseDao {

	public SalesPurchaseDaoImpl(){
		super(SalesPurchasePO.class);
	}
	
}
