package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.dao.SubFunctionActionDao;
import com.fanglin.system.po.SubFunctionActionPO;
import com.fanglin.utils.Paging;

@Repository("subFunctionActionDao")
public class SubFunctionActionDaoImpl extends DaoImpl<SubFunctionActionPO> implements SubFunctionActionDao {
	
	public SubFunctionActionDaoImpl(){
		super(SubFunctionActionPO.class);
	}
	
	@Override
	public List<SubFunctionActionPO> pageSubFunctionAction(Paging paging, List<FilterVO> filters){
		PagingQuery<SubFunctionActionPO> query = pagingQuery(paging, SubFunctionActionPO.class);
		if(filters != null){
			for(FilterVO fv: filters){
				if("actionName".equals(fv.getField())){
					query.add(query.getCriterion("actionName", fv.getData(), fv.getOp()));
				}else if("roleName".equals(fv.getField())){
					query.alias("role", "role");
					query.add(query.getCriterion("role.roleName", fv.getData(), fv.getOp()));
				}else if("roleId".equals(fv.getField())){
					query.alias("role", "role");
					query.add(query.getCriterion("role.roleId", fv.getData(), fv.getOp()));
				}else if("subFunctionName".equals(fv.getField())){
					query.alias("subFunction", "subFunction");
					query.add(query.getCriterion("subFunction.subFunctionName", fv.getData(), fv.getOp()));
				}
			}
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public	List<SubFunctionActionPO> querySubFunctionAction(){
		return session().createCriteria(SubFunctionActionPO.class)
				.createAlias("subFunction", "subFunction")
				.createAlias("subFunction.function", "function")
				.createAlias("subFunction.function.module", "module")
				.addOrder(Order.asc("module.moduleId"))
				.addOrder(Order.asc("function.functionId"))
				.addOrder(Order.asc("subFunction.subFunctionId"))
				.addOrder(Order.asc("actionId"))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SubFunctionActionPO> querySubFunctionActionBySubFunctionId(int subFunctionId){
		return session().createCriteria(SubFunctionActionPO.class)
				.add(Restrictions.eq("subFuction.subFunctionId", subFunctionId))
				.list();
	}

	@Override
	public SubFunctionActionPO querySubFunctionActionByActionName(String actionName){
		return (SubFunctionActionPO) session().createCriteria(SubFunctionActionPO.class)
				.add(Restrictions.eq("actionName", actionName))
				.uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<SubFunctionActionPO> querySubFunctionActionLikeName(String actionName){
		return  (List<SubFunctionActionPO>)session().createCriteria(SubFunctionActionPO.class)
				.add(Restrictions.like("actionName", actionName))
				.list();
	}
	
}
