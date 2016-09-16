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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.dao.ModuleDao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.utils.Paging;

@Repository("moduleDao")
public class ModuleDaoImpl extends DaoImpl<ModulePO> implements ModuleDao {
	
	public ModuleDaoImpl(){
		super(ModulePO.class);
	}

	@Override
	public List<ModulePO> pageModule(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<ModulePO> query = pagingQuery(paging, ModulePO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
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
	
	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
	}

}
