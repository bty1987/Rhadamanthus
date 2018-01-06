package com.fanglin.building.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.building.dao.BuildingScheduleDao;
import com.fanglin.building.po.BuildingSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("buildingScheduleDao")
public class BuildingScheduleDaoImpl extends DaoImpl<BuildingSchedulePO> implements BuildingScheduleDao {
	
	public BuildingScheduleDaoImpl(){
		super(BuildingSchedulePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BuildingSchedulePO> queryBuildingScheduleByBoid(long boid) {
		
		Criteria query = session().createCriteria(BuildingSchedulePO.class);
		
		query.add(Restrictions.ne(BuildingSchedulePO.COLUMN_STATUS_STR, BuildingSchedulePO.STATUS_DISABLE_SHORT));
		
		query.add(Restrictions.eq(BuildingSchedulePO.COLUMN_BOID_STR, boid));
		
		return query.list();
	}

}
