package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.system.dao.RoleActionDao;
import com.fanglin.system.po.RoleActionPO;

@Repository("roleActionDao")
public class RoleActionDaoImpl extends DaoImpl<RoleActionPO> implements RoleActionDao{

	public RoleActionDaoImpl(){
		super(RoleActionPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleActionPO> queryRoleActionByRoleId(String roleId){
		return (List<RoleActionPO>)session().createCriteria(RoleActionPO.class)
				.createAlias("role","role")
				.add(Restrictions.eq("role.roleId", roleId))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<RoleActionPO> queryRoleActionByActionName(String actionName){
		return (List<RoleActionPO>)session().createCriteria(RoleActionPO.class)
				.createAlias("subFunctionAction", "subFunctionAction")
				.add(Restrictions.eq("subFunctionAction.actionName", actionName))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<RoleActionPO> queryRoleActionByActionId(int actionId){
		return (List<RoleActionPO>)session().createCriteria(RoleActionPO.class)
				.add(Restrictions.eq("subFunctionAction.actionId", actionId))
				.list();
	}

	@Override
	public RoleActionPO queryRoleActionByActionIdARoleId(String roleId, int actionId) {
		return (RoleActionPO)session().createCriteria(RoleActionPO.class)
				.createAlias("subFunctionAction", "subFunctionAction")
				.add(Restrictions.eq("subFunctionAction.actionId", actionId))
				.add(Restrictions.eq("role.roleId", roleId))
				.uniqueResult();
	}
	
	@Override
	public RoleActionPO queryRoleActionByActionNameARoleId(String roleId, String actionName){
		return (RoleActionPO)session().createCriteria(RoleActionPO.class)
				.createAlias("subFunctionAction", "subFunctionAction")
				.add(Restrictions.eq("subFunctionAction.actionName", actionName))
				.add(Restrictions.eq("role.roleId", roleId))
				.uniqueResult();
	}
	
}
