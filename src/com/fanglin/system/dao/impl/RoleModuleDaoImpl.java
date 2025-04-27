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
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.RoleModuleDao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.system.po.RoleModulePO;
import com.fanglin.system.po.RoleModuleRO;
import com.fanglin.utils.Paging;

@Repository("roleModuleDao")
public class RoleModuleDaoImpl extends DaoImpl<RoleModulePO> implements RoleModuleDao {

	public RoleModuleDaoImpl() {
		super(RoleModulePO.class);
	}

	@Override
	public List<RoleModuleRO> pageRoleByMid(Paging paging, List<Filter> filters, Integer mid, Integer company) {

		PagingQuery<RoleModuleRO> query = pagingQuery(paging, RoleModuleRO.class);

		query.add(Restrictions.eq("module.mid", mid));

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleModulePO> queryRoleModule(int rid, short system, Integer company) {
		return session().createCriteria(RoleModulePO.class).createAlias("module", "module").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("module.system", system)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleModulePO> queryRoleModule(List<Integer> rids, short system, Integer company) {

		String sql = "select {rm.*} from communion.rolemodule rm, communion.module m where rm.rid in :rids and rm.mid = m.mid and m.system = :system and rm.company = :company group by rm.mid;";

		return session().createSQLQuery(sql).addEntity("rm", RoleModulePO.class).setParameterList("rids", rids).setShort("system", system).setInteger("company", company).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleModulePO> queryRoleModule(int rid, int level, short system, Integer company) {
		return session().createCriteria(RoleModulePO.class).createAlias("module", "module").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("module.level", level)).add(Restrictions.eq("module.system", system)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleModulePO> queryRoleModule(List<Integer> rids, int level, short system, Integer company) {

		String sql = "select {rm.*} from communion.rolemodule rm, communion.module m where rm.rid in :rids and rm.mid = m.mid and m.system = :system and m.level = :level and rm.company = :company group by rm.mid;";

		return session().createSQLQuery(sql).addEntity("rm", RoleModulePO.class).setParameterList("rids", rids).setShort("system", system).setInteger("level", level).setInteger("company", company).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleModulePO> queryRoleModuleForLink(int rid, short system, Integer company) {
		return session().createCriteria(RoleModulePO.class).createAlias("module", "module").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("link", ModulePO.LINK_LINK_INT)).add(Restrictions.eq("module.system", system)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleModulePO> queryRoleModuleForLink(List<Integer> rids, short system, Integer company) {

		String sql = "select {rm.*} from communion.rolemodule rm, communion.module m where rm.rid in :rids and rm.mid = m.mid and m.system = :system and m.link = :link and rm.company = :company group by rm.mid;";

		return session().createSQLQuery(sql).addEntity("rm", RoleModulePO.class).setParameterList("rids", rids).setShort("system", system).setShort("link", ModulePO.LINK_LINK_INT).setInteger("company", company).list();
	}

	@Override
	public RoleModulePO queryRoleModule(List<Integer> rids, int mid, Integer company) {
		return (RoleModulePO) session().createCriteria(RoleModulePO.class).createAlias("module", "module").add(Restrictions.in("rid", rids)).add(Restrictions.eq("module.mid", mid)).add(Restrictions.eq("company", company)).setMaxResults(1).uniqueResult();
	}

	@Override
	public RoleModulePO queryRoleModule(int rid, int mid, Integer company) {
		return (RoleModulePO) session().createCriteria(RoleModulePO.class).createAlias("module", "module").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("module.mid", mid)).add(Restrictions.eq("company", company)).uniqueResult();
	}

	@Override
	public int countRoleModuleByMid(int mid, Integer company) {

		String sql = "select count(*) from communion.rolemodule where mid = :mid and company = :company";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("mid", mid).setInteger("company", company).uniqueResult();

		return count.intValue();
	}

	@Override
	public int syncRoleModule(int rid, int cuid, List<Integer> companys) {

		StringBuffer syncsql = new StringBuffer("insert into communion.rolemodule (rid, mid, link, access, cuid, company) ");

		syncsql.append(" select rm1.* from (select rm.rid, rm.mid, rm.access, rm.link, :cuid, co.cid 'company' from communion.company co inner join communion.rolemodule rm where rm.rid = :rid and co.cid in :companys) rm1 ");
		syncsql.append(" left join communion.rolemodule rm2 on (rm1.rid = rm2.rid and rm1.mid = rm2.mid and rm1.company = rm2.company) ");
		syncsql.append(" where rm2.rmid is null ");

		session().createSQLQuery(syncsql.toString()).setInteger("cuid", cuid).setInteger("rid", rid).setParameterList("companys", companys).executeUpdate();

		return 0;
	}

	@Override
	public int deleteRoleModule(int rid, int company) {

		String sql = "delete from communion.rolemodule where rid = 1 and mid not in (select mid from (select mid from communion.rolemodule where rid1 = 1 and company1 = 1) t) and company != 1;";
		session().createSQLQuery(sql).setInteger("rid", rid).setInteger("company", company).setInteger("rid1", rid).setInteger("company1", company).executeUpdate();

		return 0;
	}

	@Override
	public int deleteRoleModuleByRid(int rid, int company) {

		String sql = "delete from communion.rolemodule where rid = :rid and company = :company";
		session().createSQLQuery(sql).setInteger("rid", rid).setInteger("company", company).executeUpdate();

		return 0;
	}

	@Override
	public int deleteRoleModuleByRid(int rid, short system, int company) {

		String update = "update communion.rolemodule rm, communion.module m set rm.mid = -1 where rm.rid = :rid and rm.mid = m.mid and m.system = :system and rm.company = :company";
		session().createSQLQuery(update).setInteger("rid", rid).setShort("system", system).setInteger("company", company).executeUpdate();

		String delete = "delete from communion.rolemodule where rid = :rid and mid = -1 and company = :company";
		session().createSQLQuery(delete).setInteger("rid", rid).setInteger("company", company).executeUpdate();

		return 0;
	}

	@Override
	public int deleteRoleModuleByMid(int mid, int company) {

		String sql = "delete from communion.rolemodule where mid = :mid and company = :company";
		session().createSQLQuery(sql).setInteger("mid", mid).setInteger("company", company).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("roleName".equals(field)) {
				query.alias("role", "role");
				query.add(query.getCriterion("role.name", data, op));
			} else if ("roleId".equals(field)) {
				query.alias("role", "role");
				query.add(query.getCriterion("role.rid", Integer.parseInt(data), op));
			} else if ("roleNo".equals(field)) {
				query.alias("role", "role");
				query.add(query.getCriterion("role.no", data, op));
			}
		}
	}

}
