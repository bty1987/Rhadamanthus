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
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.ModuleDao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.utils.Paging;

@Repository("moduleDao")
public class ModuleDaoImpl extends DaoImpl<ModulePO> implements ModuleDao {
	
	public ModuleDaoImpl(){
		super(ModulePO.class);
	}

	@Override
	public List<ModulePO> pageModule(Paging paging, List<Filter> filters) {
		
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
	
	@Override
	public int deleteModuleForSubByMid(int mId) {
		
		String sql = "delete from communion.module where fatherModuleId in ((select o.mId from (select * from communion.module where fatherModuleId = :mId) o))";
		session().createSQLQuery(sql).setInteger("mId", mId).executeUpdate();
		
		sql = "delete from communion.module where fatherModuleId = :mId";
		session().createSQLQuery(sql).setInteger("mId", mId).executeUpdate();
		
		return 0;
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
	}

}
