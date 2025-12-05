package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.material.dao.GoodsPackageDao;
import com.fanglin.data.po.GoodsPackagePO;

@Repository("goodsPackageDao")
public class GoodsPackageDaoImpl extends DaoImpl<GoodsPackagePO> implements GoodsPackageDao {

	public GoodsPackageDaoImpl() {
		super(GoodsPackagePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsPackagePO> queryGoodsPackage(long pid) {
		return session().createCriteria(GoodsPackagePO.class).add(Restrictions.eq(GoodsPackagePO.COLUMN_PIG_STR, pid)).list();
	}

}
