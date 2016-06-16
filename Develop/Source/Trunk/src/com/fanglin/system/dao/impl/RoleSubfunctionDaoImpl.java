package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.system.dao.RoleSubfunctionDao;
import com.fanglin.system.po.RoleSubfunctionPO;

@Repository("roleSubfunctionDao")
public class RoleSubfunctionDaoImpl extends DaoImpl<RoleSubfunctionPO> implements  RoleSubfunctionDao {
	
	public RoleSubfunctionDaoImpl(){
		super(RoleSubfunctionPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<RoleSubfunctionPO> findRoleSubFunctionByRoleId(String roleId){

		return session().createCriteria(RoleSubfunctionPO.class)
			.createAlias("subFunction.function", "function")
			.createAlias("subFunction.function.module", "module")
			.add(Restrictions.eq("role.roleId", roleId))
			.addOrder(Order.asc("module.moduleId"))
			.addOrder(Order.asc("function.functionId"))
			.addOrder(Order.asc("subFunction.subFunctionId"))
			.list();
	}
	
}
