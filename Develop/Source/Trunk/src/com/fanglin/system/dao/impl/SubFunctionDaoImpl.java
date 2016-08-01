package com.fanglin.system.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.system.dao.SubFunctionDao;
import com.fanglin.system.po.SubFunctionPO;
import com.fanglin.utils.Paging;

@Repository("subFunctionDao")
public class SubFunctionDaoImpl extends DaoImpl<SubFunctionPO> implements SubFunctionDao {
	
	public SubFunctionDaoImpl(){
		super(SubFunctionPO.class);
	}
	
	@Override
	public List<SubFunctionPO> pageSubFunction(Paging paging, String subFunctionName){
		PagingQuery<SubFunctionPO> query = pagingQuery(paging, SubFunctionPO.class);
		
		if(StringUtils.isNotEmpty(subFunctionName)){
			query.add(Restrictions.ilike("subFunctionName", subFunctionName, MatchMode.ANYWHERE));
		}
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<SubFunctionPO> querySubFunction(){
		return (List<SubFunctionPO>)session().createCriteria(SubFunctionPO.class)
				.createAlias("function", "function")
				.createAlias("function.module", "module")
				.addOrder(Order.asc("module.id"))
				.addOrder(Order.asc("function.functionId"))
				.addOrder(Order.asc("subFunctionId"))
				.list();
	}

	@Override
	public SubFunctionPO querySubFunctionByName(String subFunctionName){
		return (SubFunctionPO)session().createCriteria(SubFunctionPO.class).add(Restrictions.eq("subFunctionName",subFunctionName)).uniqueResult();
	}
	
	@Override
	public SubFunctionPO querySubFunctionById(int subFunctionId){
		return (SubFunctionPO)session().createCriteria(SubFunctionPO.class).add(Restrictions.eq("subFunctionId",subFunctionId)).uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<SubFunctionPO> querySubFunctionLikeName(String subFunctionName){
		return session().createCriteria(SubFunctionPO.class).add(Restrictions.like("subFunctionName",subFunctionName)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<SubFunctionPO> querySubFunctionByFunctionId(int functionId){
		return session().createCriteria(SubFunctionPO.class)	.add(Restrictions.eq("function.functionId", functionId)).list();
	}
	
}
