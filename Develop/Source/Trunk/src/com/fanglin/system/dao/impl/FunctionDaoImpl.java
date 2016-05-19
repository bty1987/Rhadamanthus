package com.fanglin.system.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.system.dao.FunctionDao;
import com.fanglin.system.po.FunctionPO;
import com.fanglin.utils.Paging;

@Repository("functionDao")
public class FunctionDaoImpl extends DaoImpl<FunctionPO> implements FunctionDao {
	
	public FunctionDaoImpl(){
		super(FunctionPO.class);
	}

	@Override
	public List<FunctionPO> pageFunction(Paging paging, String functionName){
		PagingQuery<FunctionPO> query = pagingQuery(paging, FunctionPO.class);
		if(StringUtils.isNotEmpty(functionName)){
			query.add(Restrictions.ilike("functionName", functionName,
					MatchMode.ANYWHERE));
		}
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionPO> queryFuctionByModuleId(int moduleId){
		return ( List<FunctionPO> )session().createCriteria(FunctionPO.class)
				.add(Restrictions.eq("module.moduleId", moduleId))
				.list();
	}
}
