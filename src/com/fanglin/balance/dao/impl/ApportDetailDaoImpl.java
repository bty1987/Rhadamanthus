package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.ApportDetailDao;
import com.fanglin.balance.po.ApportDetailPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("apportDetailDao")
public class ApportDetailDaoImpl extends DaoImpl<ApportDetailPO> implements ApportDetailDao {

	public ApportDetailDaoImpl() {
		super(ApportDetailPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ApportDetailPO> queryApportDetailForBalance(long bid) {
		
		return session().createCriteria(ApportDetailPO.class).add(Restrictions.eq("bid", bid)).list();
	}
	

}
