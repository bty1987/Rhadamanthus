package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.RoleTaskDao;
import com.fanglin.communion.po.RoleTaskPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("roleTaskDao")
public class RoleTaskDaoImpl extends DaoImpl<RoleTaskPO> implements RoleTaskDao {

	public RoleTaskDaoImpl() {
		super(RoleTaskPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleTaskPO> queryRoleTask(int rid, Integer company) {
		return session().createCriteria(RoleTaskPO.class).add(Restrictions.eq("rid", rid)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleTaskPO> queryRoleTask(List<Integer> rids, Integer company) {

		String sql = "select {rt.*} from communion.roletask rt where rt.rid in :rids and rt.company = :company group by rt.tid;";

		return session().createSQLQuery(sql).addEntity("rt", RoleTaskPO.class).setParameterList("rids", rids).setInteger("company", company).list();
	}

	@Override
	public RoleTaskPO queryRoleTask(int rid, Long tid, Integer company) {
		return (RoleTaskPO) session().createCriteria(RoleTaskPO.class).createAlias("task", "task").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("task.tid", tid)).add(Restrictions.eq("company", company)).setMaxResults(1).uniqueResult();
	}

	@Override
	public void deleteRoleTask(int rid, Integer company) {

		String sql = "DELETE FROM `communion`.roletask WHERE rid = :rid and company = :company";

		session().createSQLQuery(sql).setLong("rid", rid).setInteger("company", company).executeUpdate();
	}

	@Override
	public int deleteRoleTask(int rid, List<Integer> companys) {

		String sql = "delete from communion.roletask where rid = :rid and company in :companys";
		session().createSQLQuery(sql).setInteger("rid", rid).setParameterList("companys", companys).executeUpdate();

		return 0;
	}

	@Override
	public int syncRoleTask(int rid, int cuid, List<Integer> companys, int company) {

		StringBuffer syncsql = new StringBuffer("insert into communion.roletask (rid, tid, cuid, company) ");

		syncsql.append("select rt.rid, rt.tid, :cuid, co.cid from communion.roletask rt, communion.company co where rt.rid = :rid and rt.company = :company and co.cid in :companys");

		session().createSQLQuery(syncsql.toString()).setInteger("cuid", cuid).setInteger("rid", rid).setParameterList("companys", companys).setInteger("company", company).executeUpdate();

		return 0;
	}

}
