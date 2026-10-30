package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.AccessoriesChargeDao;
import com.fanglin.inventory.po.AccessoriesChargePO;

@Repository("accessoriesChargeDao")
public class AccessoriesChargeDaoImpl extends DaoImpl<AccessoriesChargePO> implements AccessoriesChargeDao {

	public AccessoriesChargeDaoImpl() {
		super(AccessoriesChargePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AccessoriesChargePO> queryAccessoriesChargeByAid(long aid) {
		return session().createCriteria(AccessoriesChargePO.class).add(Restrictions.eq("accessories.aid", aid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AccessoriesChargePO> queryAccessoriesChargeByIid(long aiid) {
		return session().createCriteria(AccessoriesChargePO.class).add(Restrictions.eq("accessoriesItem.aiid", aiid)).list();
	}

}
