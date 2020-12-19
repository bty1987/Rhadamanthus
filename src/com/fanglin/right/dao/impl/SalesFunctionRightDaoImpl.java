package com.fanglin.right.dao.impl;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.SalesFunctionRightDao;
import com.fanglin.right.po.SalesFunctionRightPO;

@Repository("salesFunctionRightDao")
public class SalesFunctionRightDaoImpl extends DaoImpl<SalesFunctionRightPO> implements SalesFunctionRightDao  {
	public SalesFunctionRightDaoImpl(){
		super(SalesFunctionRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<SalesFunctionRightPO> querySalesFunctionRightByName(String name) {
		return session().createCriteria(SalesFunctionRightPO.class).add(Restrictions.eq("name", name)).list();
	}

	@Override
	public int deleteSalesFunctionRightByName(String name) {
		
		String sql = "delete from platform.salesfunctionright where name = :name";
		session().createSQLQuery(sql).setString("name", name).executeUpdate();
		
		return 0;
	}
}
