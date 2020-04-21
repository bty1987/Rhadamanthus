package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.RoleChartDao;
import com.fanglin.communion.po.RoleChartPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("roleChartDao")
public class RoleChartDaoImpl extends DaoImpl<RoleChartPO> implements RoleChartDao {

	public RoleChartDaoImpl() {
		super(RoleChartPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<RoleChartPO> queryChartByRid(Integer rid) {
		
		return session().createCriteria(RoleChartPO.class).add(Restrictions.eq("rid", rid)).list();
	}

	@Override
	public int deleteRoleChartByRid(int rid) {
		
		String sql = "delete from communion.rolechart where rid = :rid";
		session().createSQLQuery(sql).setInteger("rid", rid).executeUpdate();
		
		return 0;
	}

}
