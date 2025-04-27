package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.BrandInstallDao;
import com.fanglin.data.po.BrandInstallPO;

@Repository("brandInstallDao")
public class BrandInstallDaoImpl extends DaoImpl<BrandInstallPO> implements BrandInstallDao {

	public BrandInstallDaoImpl() {
		super(BrandInstallPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandInstallPO> queryBrandInstall(long bid) {

		return session().createCriteria(BrandInstallPO.class).add(Restrictions.eq("brand.bid", bid)).list();
	}
}
