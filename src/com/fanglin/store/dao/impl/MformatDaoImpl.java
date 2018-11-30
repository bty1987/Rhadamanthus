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
	public List<MformatPO> queryMformatByGid(long gid, Short status) {

		Criteria criteria = session().createCriteria(MformatPO.class).add(Restrictions.eq(MformatPO.COLUMN_GID_STR, gid));
		
		if(status != null){
			criteria.add(Restrictions.eq("status",status));
		}
		
		return criteria.list();
		
	}
}