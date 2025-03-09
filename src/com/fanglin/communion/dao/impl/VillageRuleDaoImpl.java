package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.VillageRuleDao;
import com.fanglin.communion.po.VillageRulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("villageRuleDao")
public class VillageRuleDaoImpl extends DaoImpl<VillageRulePO> implements VillageRuleDao {

	public VillageRuleDaoImpl() {
		super(VillageRulePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<VillageRulePO> queryVillageRule(Long vid) {
		return session().createCriteria(VillageRulePO.class).add(Restrictions.eq("vid", vid)).list();
	}

}
