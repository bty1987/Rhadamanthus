/**
 * @File Name		: DecorationOrderStatusRightDaoImpl.java
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
import com.fanglin.right.dao.DecorationOrderStatusRightDao;
import com.fanglin.right.po.DecorationOrderStatusRightPO;

@Repository("decorationOrderStatusRightDao")
public class DecorationOrderStatusRightDaoImpl extends DaoImpl<DecorationOrderStatusRightPO> implements DecorationOrderStatusRightDao {
	
	public DecorationOrderStatusRightDaoImpl(){
		super(DecorationOrderStatusRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationOrderStatusRightPO> queryDecorationOrderStatusRightByUId(int uId, int company) {
		return session().createCriteria(DecorationOrderStatusRightPO.class).add(Restrictions.eq(DecorationOrderStatusRightPO.COLUMN_UID_STR, uId)).add(Restrictions.eq(DecorationOrderStatusRightPO.COLUMN_COMPANY_STR, company)).list();
	}

	@Override
	public int deleteDecorationOrderStatusRightByUId(int uId, int company) {
		
		String sql = "delete from platform.decorationorderstatusright where uId = :uId and company = :company";
		session().createSQLQuery(sql).setLong("uId", uId).executeUpdate();
		
		return 0;
	}

}
