package com.fanglin.building.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
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

		        if (BuildingNodePO.COLUMN_TYPE_STR.equals(filter.getField())) {
		        	query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
		        }else{
		        	query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
		        }
			}
		}
		query.asc("type");
		query.asc("sore");
		return query.list();
	}

	
	@Override
	@SuppressWarnings("unchecked")
	public List<BuildingNodePO> queryBuildingNodeByType(Short type) {
		
		return session().createCriteria(BuildingNodePO.class).add(Restrictions.eq("type", type)).addOrder(Order.asc("sore")).list();
	}

}
