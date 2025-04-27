package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.BrandServerDao;
import com.fanglin.data.po.BrandServerPO;

@Repository("brandServerDao")
public class BrandServerDaoImpl extends DaoImpl<BrandServerPO> implements BrandServerDao {

	public BrandServerDaoImpl() {
		super(BrandServerPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandServerPO> queryBrandServer(long bid) {

		return session().createCriteria(BrandServerPO.class).add(Restrictions.eq("brand.bid", bid)).list();

	}

}
