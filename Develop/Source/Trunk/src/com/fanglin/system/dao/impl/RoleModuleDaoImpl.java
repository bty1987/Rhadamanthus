/**
 * @File Name		: RoleModuleDaoImpl.java
 * @Package   	: com.fanglin.system.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-12
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
import com.fanglin.system.dao.RoleModuleDao;
import com.fanglin.system.po.RoleModulePO;

@Repository("roleModuleDao")
public class RoleModuleDaoImpl extends DaoImpl<RoleModulePO> implements RoleModuleDao {
	
	public RoleModuleDaoImpl(){
		super(RoleModulePO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<RoleModulePO> queryRoleModuleByRId(int rId, short system) {
		return session().createCriteria(RoleModulePO.class).createAlias("role", "role").createAlias("module", "module").add(Restrictions.eq("role.rId", rId)).add(Restrictions.eq("module.system", system)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleModulePO> queryRoleModuleByRIdALevel(int rId, int level, short system) {
		return session().createCriteria(RoleModulePO.class).createAlias("role", "role").createAlias("module", "module").add(Restrictions.eq("role.rId", rId)).add(Restrictions.eq("module.level", level)).add(Restrictions.eq("module.system", system)).list();
	}

	@Override
	public int deleteRoleModuleByRId(int rId, short system) {
		
		String sql = "delete from communion.rolemodule where rId = :rId and mid in (select mid from communion.module where system = :system)";
		session().createSQLQuery(sql).setInteger("rId", rId).setShort("system", system).executeUpdate();
		
		return 0;
	}

}
