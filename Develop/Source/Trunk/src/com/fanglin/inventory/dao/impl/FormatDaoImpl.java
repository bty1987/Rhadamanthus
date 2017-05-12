package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.FormatDao;
import com.fanglin.inventory.po.FormatPO;

@Repository("formatDao")
public class FormatDaoImpl extends DaoImpl<FormatPO> implements FormatDao{
	
	public FormatDaoImpl(){
		super(FormatPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<FormatPO> queryFormatByGid(long gid) {
		return session().createCriteria(FormatPO.class).add(Restrictions.eq(FormatPO.COLUMN_GID_STR, gid)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<FormatPO> queryFormatForEnableByGid(long gid) {
		return session().createCriteria(FormatPO.class).add(Restrictions.eq(FormatPO.COLUMN_GID_STR, gid)).add(Restrictions.eq(FormatPO.COLUMN_STATUS_STR,FormatPO.STATUS_ENABLE_INT)).list();
	}

}
