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
		
		queryFilterExcute(query, filters);
		
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
		return session().createCriteria(SubFunctionActionPO.class).add(Restrictions.eq("subFuction.subFunctionId", subFunctionId)).list();
	}

	@Override
	public SubFunctionActionPO querySubFunctionActionByActionName(String actionName){
		return (SubFunctionActionPO) session().createCriteria(SubFunctionActionPO.class).add(Restrictions.eq("actionName", actionName)).uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<SubFunctionActionPO> querySubFunctionActionLikeName(String actionName){
		return session().createCriteria(SubFunctionActionPO.class).add(Restrictions.like("actionName", actionName)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
		if(filters != null){
			for(FilterVO filter: filters){
					
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if("actionName".equals(field)){
					query.add(query.getCriterion("actionName", data, op));
				}else if("subFunctionName".equals(field)){
					query.alias("subFunction", "subFunction");
					query.add(query.getCriterion("subFunction.subFunctionName", data, op));
				}
			}
		}
	}
	
}
