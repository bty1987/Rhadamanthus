package com.fanglin.building.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.building.dao.BuildingDao;
import com.fanglin.building.po.BuildingPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("buildingDao")
public class BuildingDaoImpl extends DaoImpl<BuildingPO> implements BuildingDao {
	
	public BuildingDaoImpl(){
		super(BuildingPO.class);
	}
	
	@Override
	public List<BuildingPO> pageBuilding(Paging paging, List<Filter> filters) {
		
		PagingQuery<BuildingPO> query = pagingQuery(paging, BuildingPO.class);
		
		if(filters != null){
			
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				//待定 
				if("no".equals(field)){
					query.add(query.getCriterion(BuildingPO.COLUMN_NO_STR, data, op));
				}
			}
			
		}
		
		return query.list();
	}

	@Override
	public BuildingPO queryBuildingByHsid(Long hsid) {
		
		return (BuildingPO)session().createCriteria(BuildingPO.class).add(Restrictions.eq(BuildingPO.COLUMN_HSID_STR, hsid)).uniqueResult();
		
	}

	@Override
	public BuildingPO queryBuildingByCsid(Long csid) {
		
		return (BuildingPO)session().createCriteria(BuildingPO.class).add(Restrictions.eq(BuildingPO.COLUMN_CSID_STR, csid)).uniqueResult();
		
	}

}
