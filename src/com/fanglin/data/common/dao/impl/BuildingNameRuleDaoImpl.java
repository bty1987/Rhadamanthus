/**
 * @File Name		: BuildingNameRuleDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-8-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.BuildingNameRuleDao;
import com.fanglin.data.po.BuildingNameRulePO;
import com.fanglin.utils.Paging;

@Repository("buildNameRuleDao")
public class BuildingNameRuleDaoImpl extends DaoImpl<BuildingNameRulePO> implements BuildingNameRuleDao {
	
	public BuildingNameRuleDaoImpl(){
		super(BuildingNameRulePO.class, true);
	}
	
	@Override
	public List<BuildingNameRulePO> queryPageBuildingNameRule(Paging paging, List<Filter> filters){
		
		PagingQuery<BuildingNameRulePO> query = pagingQuery(paging, BuildingNameRulePO.class);
		
		if(filters != null){
			for(Filter filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

}
