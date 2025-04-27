package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.BrandProductDao;
import com.fanglin.data.po.BrandProductPO;

@Repository("brandProductDao")
public class BrandProductDaoImpl extends DaoImpl<BrandProductPO> implements BrandProductDao {

	public BrandProductDaoImpl() {
		super(BrandProductPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandProductPO> queryBrandProduct(long bid) {

		return session().createCriteria(BrandProductPO.class).add(Restrictions.eq("brand.bid", bid)).list();

	}

}
