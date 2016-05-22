package com.fanglin.system.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.system.dao.ModuleDao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.utils.Paging;

@Repository("moduleDao")
public class ModuleDaoImpl extends DaoImpl<ModulePO> implements ModuleDao {
	public ModuleDaoImpl(){
		super(ModulePO.class);
	}

	@Override
	public List<ModulePO> getPageModule(Paging paging, String moduleName){
		PagingQuery<ModulePO> query = pagingQuery(paging, ModulePO.class);
		
		if(StringUtils.isNotEmpty(moduleName)){
			query.add(Restrictions.ilike("moduleName", moduleName, MatchMode.ANYWHERE));
		}
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ModulePO> queryModule(){
		return session().createCriteria(ModulePO.class).list();
	}
}
