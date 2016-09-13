/**
 * @File Name		: ModuleDaoImpl.java
 * @Package   	: com.fanglin.system.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-12-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.system.dao.ModuleDao;
import com.fanglin.system.po.ModulePO;

@Repository("moduleDao")
public class ModuleDaoImpl extends DaoImpl<ModulePO> implements ModuleDao {
	
	public ModuleDaoImpl(){
		super(ModulePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ModulePO> queryModule() {
		return session().createCriteria(ModulePO.class).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ModulePO> queryModuleBySystem(short system) {
		return session().createCriteria(ModulePO.class).add(Restrictions.eq("system", system)).list();
	}

}
