package com.fanglin.building.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.building.dao.BuildingRecordDao;
import com.fanglin.building.po.BuildingRecordPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("buildingRecordDao")
public class BuildingRecordDaoImpl extends DaoImpl<BuildingRecordPO> implements BuildingRecordDao{

	public BuildingRecordDaoImpl(){
		super(BuildingRecordPO.class);
	}
	
	@Override
	public List<BuildingRecordPO> pageBuildingRecord(Paging paging, List<Filter> filters) {
		
		PagingQuery<BuildingRecordPO> query = pagingQuery(paging, BuildingRecordPO.class);
		
		if(filters != null){
			
			for (Filter filter : filters) {
				
				String field = filter.getField();
				String op = filter.getOp();
				
				if("type".equals(field)){
					query.add(query.getCriterion(BuildingRecordPO.COLUMN_TYPE_STR, Short.valueOf(filter.getData()), op));
				}else if("hsid".equals(field)){
					query.alias("houseSource", "houseSource");
					query.add(query.getCriterion(BuildingRecordPO.COLUMN_HSID_STR, Long.valueOf(filter.getData()), op));
				}else if("csid".equals(field)){
					query.alias("customerSource", "customerSource");
					query.add(query.getCriterion(BuildingRecordPO.COLUMN_CSID_STR, Long.valueOf(filter.getData()), op));
				}
				
			}
		}
		return query.list();
	}
	
	
	@Override
	@SuppressWarnings("unchecked")
	public List<BuildingRecordPO> queryBuildingRecord(Long hsid, Long csid, Short type) {
		
		Criteria query = session().createCriteria(BuildingRecordPO.class);
		
		if(hsid != null){
			query.createAlias("houseSource","houseSource").add(Restrictions.eq(BuildingRecordPO.COLUMN_HSID_STR, hsid));
		}
		
		if(csid != null){
			query.createAlias("customerSource","customerSource").add(Restrictions.eq(BuildingRecordPO.COLUMN_CSID_STR, csid));
		}
		
		if(type != null){
			query.add(Restrictions.eq(BuildingRecordPO.COLUMN_TYPE_STR, type));
		}
		
		return query.list();
	}

}
