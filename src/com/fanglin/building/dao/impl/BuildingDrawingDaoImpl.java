package com.fanglin.building.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.building.dao.BuildingDrawingDao;
import com.fanglin.building.po.BuildingDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("buildingDrawingDao")
public class BuildingDrawingDaoImpl extends DaoImpl<BuildingDrawingPO> implements BuildingDrawingDao{

	public BuildingDrawingDaoImpl(){
		super(BuildingDrawingPO.class);
	}
	
	
	@Override
	@SuppressWarnings("unchecked")
	public List<BuildingDrawingPO> queryBuildingDrawing(Long sid, Short type) {

		return session().createCriteria(BuildingDrawingPO.class).add(Restrictions.eq(BuildingDrawingPO.COLUMN_SID_STR, sid)).add(Restrictions.eq(BuildingDrawingPO.COLUMN_TYPE_STR, type)).add(Restrictions.eq("status", BuildingDrawingPO.STATUS_INIT_INT)).list();
	}

}
