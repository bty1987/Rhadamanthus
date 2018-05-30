package com.fanglin.data.common.dao.impl;


import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;


import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.UserlabelDao;
import com.fanglin.data.po.UserlabelPO;

@Repository("userlabelDao")
public class UserlabelDaoImpl extends DaoImpl<UserlabelPO> implements UserlabelDao {

	public UserlabelDaoImpl(){
		super(UserlabelPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<UserlabelPO> querylabelByuid(Integer uid) {
		
		return session().createCriteria(UserlabelPO.class).add(Restrictions.eq(UserlabelPO.COLUMN_USER_STR, uid)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserlabelPO> queryUserLbaelBylids(List<Integer> lids) {
		
		StringBuffer sql = new StringBuffer();
		
		 sql.append("select  ul.ulid , ul.uid, ul.lid, CONVERT(ul.`value`*l.proportion,DECIMAL(10,2))  as value  ");
		 sql.append(" from communion.userlabel ul ,communion.label l   where ul.lid in (:lids)  and ul.lid = l.lid   ");
		 sql.append("group by ul.uid "); 
		 sql.append("ORDER BY value desc  ");
		 sql.append("limit 3; ");
		
		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).addEntity(UserlabelPO.class).setParameterList("lids", lids);

		return query.list();
	}

	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserlabelPO> queryUserLabelByUidValue(Integer uid) {
		
		StringBuffer sql = new StringBuffer();
		
		sql.append("SELECT ul.ulid , ul.uid, ul.lid, CONVERT ( ul.VALUE * l.proportion,DECIMAL (10, 2)) AS VALUE ");
		sql.append("FROM communion.userlabel ul, communion.label l WHERE ul.uid = :uid AND ul.lid = l.lid ORDER BY VALUE DESC LIMIT 3");
		
		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).addEntity(UserlabelPO.class).setInteger("uid", uid);
		
		return query.list();
	}
	
	

}
