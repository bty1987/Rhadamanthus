package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.VustomerNetDao;
import com.fanglin.customer.po.VustomerNetPO;

@Repository("vustomerNetDao")
public class VustomerNetDaoImpl extends DaoImpl<VustomerNetPO> implements  VustomerNetDao{

	public VustomerNetDaoImpl(){
		super(VustomerNetPO.class);
	}
	
	@Override
	public List<?> countByUnionId(String unionId) {
		
		String sql = "select count(*) from customer.vustomernet where unionId = :unionId";
		
		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setString(VustomerNetPO.COLUMN_UNIONID_STR, unionId) ;
		
		return query.list();
	}
	
	@Override
	public VustomerNetPO queryVustomerNet(String unionId, String netunionId) {
		return  (VustomerNetPO) session().createCriteria(VustomerNetPO.class).add(Restrictions.eq(VustomerNetPO.COLUMN_UNIONID_STR, unionId)).add(Restrictions.eq(VustomerNetPO.COLUMN_NETUNIONID_STR, netunionId)).uniqueResult();
	}
	
}
