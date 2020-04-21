package com.fanglin.communion.dao.impl;


import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.HouseLayoutDao;
import com.fanglin.communion.po.HouseLayoutPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("houseLayoutDao")
public class HouseLayoutDaoImpl extends DaoImpl<HouseLayoutPO> implements HouseLayoutDao {

	public HouseLayoutDaoImpl() {
		super(HouseLayoutPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<HouseLayoutPO> queryHouseLayout(long vid) {
		return session().createCriteria(HouseLayoutPO.class).add(Restrictions.eq("vid", vid)).list();
	}

}
