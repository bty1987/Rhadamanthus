package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.material.dao.RemeasureFormatDao;
import com.fanglin.data.po.RemeasureFormatPO;

@Repository("remeasureFormatDao")
public class RemeasureFormatDaoImpl extends DaoImpl<RemeasureFormatPO> implements RemeasureFormatDao {

	public RemeasureFormatDaoImpl() {
		super(RemeasureFormatPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RemeasureFormatPO> queryRemeasureFormatByBid(Long bid) {
		return session().createCriteria(RemeasureFormatPO.class).createAlias("brand", "brand").add(Restrictions.eq(RemeasureFormatPO.COLUMN_BRAND_INT, bid)).list();
	}

}
