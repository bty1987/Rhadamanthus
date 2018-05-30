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
	public List<McolorPO> queryMcolorByGid(long gid, Boolean flag) {
		
		Criteria criteria = session().createCriteria(McolorPO.class).add(Restrictions.eq(McolorPO.COLUMN_GID_STR, gid));
		
		if(flag){
			criteria.add(Restrictions.eq("status", McolorPO.STATUS_ABLE_SHORT));
		}
		
		return criteria.list();
	}

}
