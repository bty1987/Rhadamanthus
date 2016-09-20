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
	public List<RoleOperationPO> queryRoleOperationByRId(int rId, short system) {
		return session().createCriteria(RoleOperationPO.class).createAlias("role", "role").createAlias("operation", "operation").add(Restrictions.eq("role.rId", rId)).add(Restrictions.eq("operation.system", system)).list();
	}

	@Override
	public RoleOperationPO queryRoleOperationByOperationName(String operationName, short system) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").add(Restrictions.eq("operation.operationName", operationName)).add(Restrictions.eq("operation.system", system)).uniqueResult();
	}

	@Override
	public RoleOperationPO queryRoleOperationByOperationARId(String operation, int rId, short system) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").createAlias("role", "role").add(Restrictions.eq("role.rId", rId)).add(Restrictions.eq("operation.operation", operation)).add(Restrictions.eq("operation.system", system)).uniqueResult();
	}

	@Override
	public RoleOperationPO queryRoleOperationByRIdAOId(int rId, int oId) {
		return (RoleOperationPO) session().createCriteria(RoleOperationPO.class).createAlias("operation", "operation").createAlias("role", "role").add(Restrictions.eq("role.rId", rId)).add(Restrictions.eq("operation.oid", oId)).uniqueResult();
	}

	@Override
	public int deleteRoleOperationByRId(int rId, short system) {
		
		String sql = "delete from communion.roleoperation where rId = :rId and oId in (select oId from communion.operation where system = :system)";
		session().createSQLQuery(sql).setInteger("rId", rId).setShort("system", system).executeUpdate();
		
		return 0;
	}

}
