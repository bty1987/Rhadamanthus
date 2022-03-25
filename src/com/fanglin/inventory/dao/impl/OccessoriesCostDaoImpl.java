package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.OccessoriesCostDao;
import com.fanglin.inventory.po.OccessoriesCostPO;

@Repository("occessoriesCostDao")
public class OccessoriesCostDaoImpl extends DaoImpl<OccessoriesCostPO> implements OccessoriesCostDao {

	public OccessoriesCostDaoImpl(){
		super(OccessoriesCostPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<OccessoriesCostPO> queryOccessoriesCost(long oid) {
		return session().createCriteria(OccessoriesCostPO.class).add(Restrictions.eq("oid", oid)).list();
	}

}
