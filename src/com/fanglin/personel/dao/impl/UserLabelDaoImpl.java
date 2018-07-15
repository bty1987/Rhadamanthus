package com.fanglin.personel.dao.impl;


import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;


import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.UserLabelDao;
import com.fanglin.personel.po.UserLabelPO;

@Repository("userlabelDao")
public class UserLabelDaoImpl extends DaoImpl<UserLabelPO> implements UserLabelDao {

	public UserLabelDaoImpl(){
		super(UserLabelPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<UserLabelPO> queryUserLabelByUid(Integer uid) {
		
		return session().createCriteria(UserLabelPO.class).add(Restrictions.eq(UserLabelPO.COLUMN_USER_STR, uid)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserLabelPO> pickUserLabel(List<Integer> userLabel) {
		
		StringBuffer sql = new StringBuffer();
		
		 sql.append("select  ul.ulid , ul.uid, ul.lid, sum(ul.scope * l.scale)  as scope  ");
		 sql.append(" from communion.userlabel ul ,communion.label l  where ul.lid in (:userLabel)  and ul.lid = l.lid   ");
		 sql.append("group by ul.uid "); 
		 sql.append("ORDER BY scope desc  ");
		 sql.append("limit 3; ");
		 
		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).addEntity(UserLabelPO.class).setParameterList("userLabel", userLabel);

		return query.list();
	}
	

}
