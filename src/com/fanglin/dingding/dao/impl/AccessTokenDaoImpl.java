/**
 * @File Name		: DAccessTokenDao.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.dao.impl;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.dingding.dao.AccessTokenDao;
import com.fanglin.dingding.po.AccessTokenPO;

@Repository("accessTokenDao")
public class AccessTokenDaoImpl extends DaoImpl<AccessTokenPO> implements AccessTokenDao {

	public AccessTokenDaoImpl() {
		super(AccessTokenPO.class);
	}

	@Override
	public AccessTokenPO queryAccessToken(int company) {
		return (AccessTokenPO) session().createCriteria(AccessTokenPO.class).add(Restrictions.eq(AccessTokenPO.COLUMN_COMPANY_STR, company)).addOrder(Order.desc(AccessTokenPO.COLUMN_OPERATETIME_STR)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deleteAccessToken(long operateTime) {

		String sql = "delete from hades.daccesstoken where operateTime < :operateTime";
		session().createSQLQuery(sql).setLong("operateTime", operateTime).executeUpdate();

		return 0;
	}

}
