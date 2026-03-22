package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.OccessoriesChargeDao;
import com.fanglin.inventory.po.OccessoriesChargePO;

@Repository("occessoriesChargeDao")
public class OccessoriesChargeDaoImpl extends DaoImpl<OccessoriesChargePO> implements OccessoriesChargeDao {

	public OccessoriesChargeDaoImpl() {
		super(OccessoriesChargePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OccessoriesChargePO> queryOccessoriesChargeByOid(long oid) {
		return session().createCriteria(OccessoriesChargePO.class)
				.add(Restrictions.eq("oid", oid))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OccessoriesChargePO> queryOccessoriesChargeByOiid(long oiid) {
		return session().createCriteria(OccessoriesChargePO.class)
				.add(Restrictions.eq("oiid", oiid))
				.list();
	}

}
