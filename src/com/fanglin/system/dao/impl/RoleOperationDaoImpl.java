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
	public List<RoleOperationPO> queryRoleOperationByRid(int rId) {
		return session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.eq("rid", rId)).add(Restrictions.eq("operation.status", OperationPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public RoleOperationPO queryRoleOperation(String operation, int rid) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("operation.operation", operation)).add(Restrictions.eq("operation.status", OperationPO.STATUS_ENABLE_INT)).uniqueResult();
	}

	@Override
	public RoleOperationPO queryRoleOperation(int rid, int oid) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("operation.oid", oid)).uniqueResult();
	}

	@Override
	public RoleOperationPO queryRoleOperation(List<Integer> rids, int oid) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.in("rid", rids)).add(Restrictions.eq("operation.oid", oid)).uniqueResult();
	}

	@Override
	public int countRoleOperationByOid(int oid) {

		String sql = "select count(*) from communion.roleoperation where oid = :oid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("oid", oid).uniqueResult();

		return count.intValue();
	}

	@Override
	public int deleteRoleOperationByRid(int rid) {

		String sql = "delete from communion.roleoperation where rid = :rid";
		session().createSQLQuery(sql).setInteger("rid", rid).executeUpdate();

		return 0;
	}

	@Override
	public int deleteRoleOperationByOId(int oid) {

		String sql = "delete from communion.roleoperation where oid = :oid";
		session().createSQLQuery(sql).setInteger("oid", oid).executeUpdate();

		return 0;
	}

}
