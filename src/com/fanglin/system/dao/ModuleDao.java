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

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.ModulePO;
import com.fanglin.utils.Paging;

public interface ModuleDao extends Dao<ModulePO> {

	public List<ModulePO> pageModule(Paging paging, List<Filter> filters);

	public List<ModulePO> queryModule();

	public List<ModulePO> queryModuleBySystem(short system);

	public int deleteModuleForSubByMid(int mId);

}
