package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesPurchaseDao;
import com.fanglin.sales.po.SalesPurchasePO;

@Repository("salesPurchaseDao")
public class SalesPurchaseDaoImpl extends DaoImpl<SalesPurchasePO> implements SalesPurchaseDao {

	public SalesPurchaseDaoImpl(){
		super(SalesPurchasePO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SalesPurchasePO> querySalesPurchaseBySid(long sid) {
		return createCriteria(SalesPurchasePO.class).createAlias("sales", "sales").add(Restrictions.eq(SalesPurchasePO.COLUMN_SALESSID_STR, sid)).list();
	}
	
}
