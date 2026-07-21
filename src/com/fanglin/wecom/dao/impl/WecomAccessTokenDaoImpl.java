/**
 * @File Name		: WecomAccessTokenDaoImpl.java
 * @Package   	: com.fanglin.wecom.dao.impl
 * @Version		: 1.0
 * @Date			: 2026-7-5
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 企业微信 access_token 数据访问实现
 */

package com.fanglin.wecom.dao.impl;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.wecom.dao.WecomAccessTokenDao;
import com.fanglin.wecom.po.WecomAccessTokenPO;

@Repository("wecomAccessTokenDao")
public class WecomAccessTokenDaoImpl extends DaoImpl<WecomAccessTokenPO> implements WecomAccessTokenDao {

	public WecomAccessTokenDaoImpl() {
		super(WecomAccessTokenPO.class);
	}

	@Override
	public WecomAccessTokenPO queryAccessToken(int company) {
		return (WecomAccessTokenPO) session().createCriteria(WecomAccessTokenPO.class).add(Restrictions.eq(WecomAccessTokenPO.COLUMN_COMPANY_STR, company)).addOrder(Order.desc(WecomAccessTokenPO.COLUMN_OPERATETIME_STR)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deleteAccessToken(long operateTime) {

		String sql = "delete from hades.eaccesstoken where operateTime < :operateTime";
		session().createSQLQuery(sql).setLong("operateTime", operateTime).executeUpdate();

		return 0;
	}

	@Override
	public int deleteAccessTokenByCompany(int company) {

		String sql = "delete from hades.eaccesstoken where company = :company";
		session().createSQLQuery(sql).setInteger("company", company).executeUpdate();

		return 0;
	}

}
