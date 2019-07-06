package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.BuildingNameRulePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingNameRuleDao extends Dao<BuildingNameRulePO> {

	public List<BuildingNameRulePO> queryPageBuildingNameRule(Paging paging, List<Filter> filters);

}
