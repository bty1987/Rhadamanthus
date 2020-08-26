package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.BrandBalanceDao;
import com.fanglin.data.po.BrandBalancePO;

@Repository("brandBalanceDao")
public class BrandBalanceDaoImpl extends DaoImpl<BrandBalancePO> implements BrandBalanceDao {

	public BrandBalanceDaoImpl(){
		super(BrandBalancePO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<BrandBalancePO> queryBrandBalance(long bid) {
		
		return session().createCriteria(BrandBalancePO.class).add(Restrictions.eq("bid", bid)).list();
	}

}
