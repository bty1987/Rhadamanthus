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
import com.fanglin.system.po.RoleOperationPO;

@Repository("roleOperationDao")
public class RoleOperationDaoImpl extends DaoImpl<RoleOperationPO> implements RoleOperationDao {
	
	public RoleOperationDaoImpl(){
		super(RoleOperationPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<RoleOperationPO> queryRoleOperationByRid(int rId, short system) {
		return session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.eq("rid", rId)).add(Restrictions.eq("operation.system", system)).list();
	}

	@Override
	public RoleOperationPO queryRoleOperationByOperationName(String operationName, short system) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.eq("operation.operationName", operationName)).add(Restrictions.eq("operation.system", system)).uniqueResult();
	}

	@Override
	public RoleOperationPO queryRoleOperationByOperationARid(String operation, int rid, short system) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("operation.operation", operation)).add(Restrictions.eq("operation.system", system)).uniqueResult();
	}

	@Override
	public RoleOperationPO queryRoleOperationByRidAOid(int rid, int oid) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.eq("rid", rid)).add(Restrictions.eq("operation.oid", oid)).uniqueResult();
	}

	@Override
	public int deleteRoleOperationByRid(int rid, short system) {
		
		String sql = "delete from communion.roleoperation where rid = :rid and oid in (select oid from communion.operation where system = :system)";
		session().createSQLQuery(sql).setInteger("rid", rid).setShort("system", system).executeUpdate();
		
		return 0;
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
