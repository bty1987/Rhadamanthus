package com.fanglin.upgrade.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.upgrade.po.VersionPO;
import com.fanglin.utils.Paging;

public interface VersionDao extends Dao<VersionPO>{
	
	public List<VersionPO> pageVersion(Paging paging, List<Filter> filters);

	public List<VersionPO> queryVersion(List<Filter> filters);
	
	public List<VersionPO> matchVersion(String trialversion);
	
}
