/**
 * @File Name		: RoleOperationDaoImpl.java
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
import com.fanglin.system.dao.RoleOperationDao;
import com.fanglin.system.po.OperationPO;
import com.fanglin.system.po.RoleOperationPO;

@Repository("roleOperationDao")
public class RoleOperationDaoImpl extends DaoImpl<RoleOperationPO> implements RoleOperationDao {

	public RoleOperationDaoImpl() {
		super(RoleOperationPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleOperationPO> queryRoleOperationByRid(int rId, Integer company) {
		return session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.eq("rid", rId)).add(Restrictions.eq("operation.status", OperationPO.STATUS_ENABLE_INT)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleOperationPO> queryRoleOperation(List<Integer> rids, Integer company) {

		String sql = "select {ro.*} from communion.roleoperation ro, communion.operation o where ro.rid in :rids and ro.oid = o.oid and o.status = :status and ro.company = :company group by ro.oid;";

		return session().createSQLQuery(sql).addEntity("ro", RoleOperationPO.class).setParameterList("rids", rids).setShort("status", OperationPO.STATUS_ENABLE_INT).setInteger("company", company).list();
	}

	@Override
	public RoleOperationPO queryRoleOperation(String operation, int rid, Integer company) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("operation.operation", operation)).add(Restrictions.eq("operation.status", OperationPO.STATUS_ENABLE_INT)).add(Restrictions.eq("company", company)).setMaxResults(1).uniqueResult();
	}

	@Override
	public RoleOperationPO queryRoleOperation(int rid, int oid, Integer company) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("operation.oid", oid)).add(Restrictions.eq("company", company)).setMaxResults(1).uniqueResult();
	}

	@Override
	public RoleOperationPO queryRoleOperation(List<Integer> rids, int oid) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.in("rid", rids)).add(Restrictions.eq("operation.oid", oid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countRoleOperationByOid(int oid, Integer company) {

		String sql = "select count(*) from communion.roleoperation where oid = :oid and company = :company";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("oid", oid).setInteger("company", company).uniqueResult();

		return count.intValue();
	}

	@Override
	public int deleteRoleOperationByRid(int rid, Integer company) {

		String sql = "delete from communion.roleoperation where rid = :rid and company = :company";
		session().createSQLQuery(sql).setInteger("rid", rid).setInteger("company", company).executeUpdate();

		return 0;
	}

	@Override
	public int deleteRoleOperationByOId(int oid, Integer company) {

		String sql = "delete from communion.roleoperation where oid = :oid and company = :company";
		session().createSQLQuery(sql).setInteger("oid", oid).setInteger("company", company).executeUpdate();

		return 0;
	}

}
