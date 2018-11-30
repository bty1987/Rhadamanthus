package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.store.dao.McolorDao;
import com.fanglin.store.po.McolorPO;

@Repository("mcolorDao")
public class McolorDaoImpl extends DaoImpl<McolorPO> implements McolorDao{

	public McolorDaoImpl() {
		super(McolorPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<McolorPO> queryMcolorByGid(long gid, Short status) {
		
		Criteria criteria = session().createCriteria(McolorPO.class).add(Restrictions.eq(McolorPO.COLUMN_GID_STR, gid));
		
		if(status != null){
			criteria.add(Restrictions.eq("status", status));
		}
		
		return criteria.list();
	}

}
