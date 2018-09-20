package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.ConstructerDao;

@Repository("constructerOrderDao")
public class ConstructerDaoImpl extends DaoImpl<ConstructerPO> implements ConstructerDao {
	
	public ConstructerDaoImpl(){
		super(ConstructerPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructerPO> queryCusConstructer(String orderId) {
		
		return  session().createCriteria(ConstructerPO.class).add(Restrictions.eq(ConstructerPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(ConstructerPO.COLUMN_STATUS_STR, ConstructerPO.STATUS_ENABLE_SHORT)).list();
	}

}
