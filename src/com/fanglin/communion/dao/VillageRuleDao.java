package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.VillageRulePO;
import com.fanglin.core.dao.Dao;

public interface VillageRuleDao extends Dao<VillageRulePO> {

	public List<VillageRulePO> queryVillageRule(Long vid);

}
