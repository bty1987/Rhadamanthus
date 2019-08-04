package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.DecorationFunctionRightDao;
import com.fanglin.right.po.DecorationFunctionRightPO;

@Repository("decorationFunctionRightDao")
public class DecorationFunctionRightDaoImpl extends DaoImpl<DecorationFunctionRightPO> implements DecorationFunctionRightDao {
	
	public DecorationFunctionRightDaoImpl(){
		super(DecorationFunctionRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationFunctionRightPO> queryDecorationFunctionRightByName(String name) {
		return session().createCriteria(DecorationFunctionRightPO.class).add(Restrictions.eq("name", name)).list();
	}

	@Override
	public int deleteDecorationFunctionRightByName(String name) {
		
		String sql = "delete from platform.decorationfunctionright where name = :name";
		session().createSQLQuery(sql).setString("name", name).executeUpdate();
		
		return 0;
	}
	
	

}
