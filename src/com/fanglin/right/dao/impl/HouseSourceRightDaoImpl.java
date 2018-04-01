package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.HouseSourceRightDao;
import com.fanglin.right.po.HouseSourceDepartmentRightPO;

@Repository("houseSourceDepartmentRightDao")
public class HouseSourceRightDaoImpl extends DaoImpl<HouseSourceDepartmentRightPO> implements HouseSourceRightDao {

	public HouseSourceRightDaoImpl(){
		super(HouseSourceDepartmentRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<HouseSourceDepartmentRightPO> queryHouseSourceDepartmentRightByUid(int uid, int company) {
		
		return session().createCriteria(HouseSourceDepartmentRightPO.class).add(Restrictions.eq(HouseSourceDepartmentRightPO.COLUMN_UID_STR, uid)).add(Restrictions.eq(HouseSourceDepartmentRightPO.COLUMN_COMPANY_STR, company)).list();
		
	}

	@Override
	public void deleteHouseSourceDepartmentRightByUid(int uid, int company) {
		
		String sql = "delete from platform.houseSourceDepartmentright where uid = :uid and company = :company";
		
		session().createSQLQuery(sql).setLong("uid", uid).setInteger("company", company).executeUpdate();
		
	}

}
