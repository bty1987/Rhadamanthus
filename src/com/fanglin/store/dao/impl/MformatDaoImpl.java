package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.store.dao.MformatDao;
import com.fanglin.store.po.MformatPO;

@Repository("mformatDao")
public class MformatDaoImpl extends DaoImpl<MformatPO> implements MformatDao {

	public MformatDaoImpl() {
		super(MformatPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MformatPO> queryMformatByGid(long gid, Boolean flag) {

		Criteria criteria = session().createCriteria(MformatPO.class).add(Restrictions.eq(MformatPO.COLUMN_GID_STR, gid));
		
		if(flag){
			criteria.add(Restrictions.eq("status",MformatPO.STATUS_ABLE_SHORT));
		}
		
		return criteria.list();
		
	}
}