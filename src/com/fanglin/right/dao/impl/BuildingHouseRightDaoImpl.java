package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.BuildingHouseRightDao;
import com.fanglin.right.po.BuildingHouseDepartmentRightPO;

@Repository("houseSourceDepartmentRightDao")
public class BuildingHouseRightDaoImpl extends DaoImpl<BuildingHouseDepartmentRightPO> implements BuildingHouseRightDao {

	public BuildingHouseRightDaoImpl() {
		super(BuildingHouseDepartmentRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BuildingHouseDepartmentRightPO> queryBuildingHouseDepartmentRightByUid(int uid, int company) {

		return session().createCriteria(BuildingHouseDepartmentRightPO.class).add(Restrictions.eq(BuildingHouseDepartmentRightPO.COLUMN_UID_STR, uid)).add(Restrictions.eq(BuildingHouseDepartmentRightPO.COLUMN_COMPANY_STR, company)).list();

	}

	@Override
	public void deleteBuildingHouseDepartmentRightByUid(int uid, int company) {

		String sql = "delete from platform.houseSourceDepartmentright where uid = :uid and company = :company";

		session().createSQLQuery(sql).setLong("uid", uid).setInteger("company", company).executeUpdate();

	}

}
