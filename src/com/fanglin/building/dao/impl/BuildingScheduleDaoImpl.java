package com.fanglin.building.dao.impl;

import java.sql.Timestamp;
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
	public List<BuildingSchedulePO> queryBuildingScheduleByBid(Long bid) {
		
		Criteria query = session().createCriteria(BuildingSchedulePO.class);
		
		query.add(Restrictions.eq(BuildingSchedulePO.COLUMN_BID_STR, bid));
		
		query.add(Restrictions.ne(BuildingSchedulePO.COLUMN_STATUS_STR, BuildingSchedulePO.STATUS_DISABLE_SHORT));
		
		return query.list();
	}

	@Override
	public void resetBuildingSchedule(Long bid, Integer uid) {
		
		String sql = "UPDATE building.buildingSchedule SET status = :status, ouid = :ouid, operatTime = :operatTime WHERE bid = :bid";

		session().createSQLQuery(sql).setShort("status", BuildingSchedulePO.STATUS_DISABLE_SHORT).setInteger("ouid", uid).setTimestamp("operatTime", new Timestamp(System.currentTimeMillis())).setLong("bid", bid).executeUpdate();
		
	}

}
