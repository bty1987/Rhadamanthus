package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.BrandDeliverDao;
import com.fanglin.data.po.BrandDeliverPO;

@Repository("brandDeliverDao")
public class BrandDeliverDaoImpl extends DaoImpl<BrandDeliverPO> implements BrandDeliverDao {

	public BrandDeliverDaoImpl() {
		super(BrandDeliverPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandDeliverPO> queryBrandDeliver(long bid) {
		return session().createCriteria(BrandDeliverPO.class).add(Restrictions.eq("brand.bid", bid)).list();
	}
}
