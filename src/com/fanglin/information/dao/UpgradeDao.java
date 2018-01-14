package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.UpgradePO;
import com.fanglin.utils.Paging;

public interface UpgradeDao extends Dao<UpgradePO>{
	
	public List<UpgradePO> pageUpgrade(Paging paging, List<Filter> filters);

	public List<UpgradePO> queryUpgrade(List<Filter> filters);
	
	public List<UpgradePO> matchUpgrade(String trialno);
	
}
