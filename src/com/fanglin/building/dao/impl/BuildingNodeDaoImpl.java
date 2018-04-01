package com.fanglin.building.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.building.dao.BuildingNodeDao;
import com.fanglin.building.po.BuildingNodePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("buildingNodeDao")
public class BuildingNodeDaoImpl extends DaoImpl<BuildingNodePO> implements BuildingNodeDao{

	public BuildingNodeDaoImpl(){
		super(BuildingNodePO.class);
	}
	
	@Override
	public List<BuildingNodePO> pageBuildingNode(Paging paging, List<Filter> filters) {
		
		PagingQuery<BuildingNodePO> query = pagingQuery(paging, BuildingNodePO.class);
		
		if (filters != null) {
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
		        if (BuildingNodePO.COLUMN_TYPE_STR.equals(field)) {
		        	query.add(query.getCriterion(field, Short.valueOf(data), op));
		        }
			}
		}
		
		query.asc("type");
		query.asc("sore");
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BuildingNodePO> queryBuildingNodeByType(Short type, Short sore, Short status) {
		
		Criteria criteria = session().createCriteria(BuildingNodePO.class).add(Restrictions.eq("type", type));
		
		if(sore != null){
			criteria.add(Restrictions.eq("sore", sore));
		}
		
		if(status != null){
			criteria.add(Restrictions.eq("status", BuildingNodePO.STATUS_ENABLE_SHORT));
		}
		
		return criteria.list();
	}

}
