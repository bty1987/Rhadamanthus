package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.OccessoriesItemDao;
import com.fanglin.inventory.po.OccessoriesItemPO;

@Repository("occessoriesItemDao")
public class OccessoriesItemDaoImpl extends DaoImpl<OccessoriesItemPO> implements OccessoriesItemDao {

	public OccessoriesItemDaoImpl(){
		super(OccessoriesItemPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<OccessoriesItemPO> queryOccessoriesItemByOid(long oid) {
		return session().createCriteria(OccessoriesItemPO.class).add(Restrictions.eq("oid", oid)).list();
	}

}
