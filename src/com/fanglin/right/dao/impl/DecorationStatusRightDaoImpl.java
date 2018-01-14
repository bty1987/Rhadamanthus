/**
 * @File Name		: DecorationStatusRightDaoImpl.java
 * @Package   	: com.fanglin.right.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.DecorationStatusRightDao;
import com.fanglin.right.po.DecorationStatusRightPO;

@Repository("decorationStatusRightDao")
public class DecorationStatusRightDaoImpl extends DaoImpl<DecorationStatusRightPO> implements DecorationStatusRightDao {
	
	public DecorationStatusRightDaoImpl(){
		super(DecorationStatusRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationStatusRightPO> queryDecorationStatusRightByUId(int uId, int company) {
		return session().createCriteria(DecorationStatusRightPO.class).add(Restrictions.eq(DecorationStatusRightPO.COLUMN_UID_STR, uId)).add(Restrictions.eq(DecorationStatusRightPO.COLUMN_COMPANY_STR, company)).list();
	}

	@Override
	public int deleteDecorationStatusRightByUId(int uId, int company) {
		
		String sql = "delete from platform.decorationstatusright where uId = :uId and company = :company";
		session().createSQLQuery(sql).setLong("uId", uId).setInteger("company", company).executeUpdate();
		
		return 0;
	}

}
