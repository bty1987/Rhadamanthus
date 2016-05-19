package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.utils.Paging;

public interface ModuleDao extends Dao<ModulePO> {

	public List<ModulePO> getPageModule(Paging paging, String moduleName);
	
	public List<ModulePO> queryModule();

}
