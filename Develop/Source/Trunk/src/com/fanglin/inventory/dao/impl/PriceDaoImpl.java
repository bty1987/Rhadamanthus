package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.PriceDao;
import com.fanglin.inventory.po.PricePO;
@Repository("priceDao")
public class PriceDaoImpl extends DaoImpl<PricePO> implements PriceDao{
	
	public PriceDaoImpl(){
		super(PricePO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<PricePO> queryPriceByGid(long gid) {
		return session().createCriteria(PricePO.class).add(Restrictions.eq(PricePO.COLUMN_GID_STR, gid)).list();
	}

}
