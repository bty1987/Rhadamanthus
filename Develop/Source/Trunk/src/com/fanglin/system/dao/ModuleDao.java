/**
 * @File Name		: ModuleDao.java
 * @Package   	: com.fanglin.system.dao
 * @Version		: 1.0
 * @Date			: 2015-12-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.system.po.ModulePO;

public interface ModuleDao {
	
	public List<ModulePO> queryModule();
	
	public List<ModulePO> queryModuleBySystem(short system);
	
}
