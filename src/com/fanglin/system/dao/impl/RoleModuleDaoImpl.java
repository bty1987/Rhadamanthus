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

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.system.dao.RoleModuleDao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.system.po.RoleModulePO;

@Repository("roleModuleDao")
public class RoleModuleDaoImpl extends DaoImpl<RoleModulePO> implements RoleModuleDao {

	public RoleModuleDaoImpl() {
		super(RoleModulePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleModulePO> queryRoleModule(int rid, short system) {
		return session().createCriteria(RoleModulePO.class).createAlias("module", "module").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("module.system", system)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleModulePO> queryRoleModule(int rid, int level, short system) {
		return session().createCriteria(RoleModulePO.class).createAlias("module", "module").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("module.level", level)).add(Restrictions.eq("module.system", system)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleModulePO> queryRoleModuleForLink(int rid, short system) {
		return session().createCriteria(RoleModulePO.class).createAlias("module", "module").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("link", ModulePO.LINK_LINK_INT)).add(Restrictions.eq("module.system", system)).list();
	}

	@Override
	public RoleModulePO queryRoleModule(int rid, int mid) {
		return (RoleModulePO) session().createCriteria(RoleModulePO.class).createAlias("module", "module").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("module.mid", mid)).uniqueResult();
	}

	@Override
	public int countRoleModuleByMid(int mid) {

		String sql = "select count(*) from communion.rolemodule where mid = :mid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("mid", mid).uniqueResult();

		return count.intValue();
	}

	@Override
	public int deleteRoleModuleByRid(int rid) {

		String sql = "delete from communion.rolemodule where rid = :rid";
		session().createSQLQuery(sql).setInteger("rid", rid).executeUpdate();

		return 0;
	}

	@Override
	public int deleteRoleModuleByRid(int rid, short system) {

		String sql = "delete from communion.rolemodule where rid = :rid and mid in (select mid from communion.module where system = :system)";
		session().createSQLQuery(sql).setInteger("rid", rid).setShort("system", system).executeUpdate();

		return 0;
	}

	@Override
	public int deleteRoleModuleByMid(int mid) {

		String sql = "delete from communion.rolemodule where mid = :mid";
		session().createSQLQuery(sql).setInteger("mid", mid).executeUpdate();

		return 0;
	}

}
