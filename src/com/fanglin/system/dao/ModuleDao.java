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

	public List<ModulePO> queryModule(Short system, Short level);

	public List<ModulePO> queryModuleBySystem(short system);

	public int deleteModule(int mId);

	public List<ModulePO> queryModuleByFatherModule(Short system, Integer mid);

	/**
	 * 根据层级和父模块ID查询模块
	 * @param system 系统标识
	 * @param level 模块层级
	 * @param fatherId 父模块ID（可选，如果为null则查询该层级所有模块）
	 * @return 指定层级的模块列表
	 */
	public List<ModulePO> queryModuleByLevel(Short system, Short level, Integer fatherId);

}
