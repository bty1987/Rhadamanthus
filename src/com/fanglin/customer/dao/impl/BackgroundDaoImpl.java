package com.fanglin.customer.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.BackgroundDao;
import com.fanglin.customer.po.BackgroundPO;

@Repository("backgroundDao")
public class BackgroundDaoImpl extends DaoImpl<BackgroundPO> implements BackgroundDao {

	public BackgroundDaoImpl() {
		super(BackgroundPO.class);
	}

	@Override
	public BackgroundPO queryBackgroundByUnionId(String unionId) {
		return (BackgroundPO) createCriteria(BackgroundPO.class).add(Restrictions.eq(BackgroundPO.COLUMN_UNIONID_STR, unionId)).uniqueResult();
	}

}
