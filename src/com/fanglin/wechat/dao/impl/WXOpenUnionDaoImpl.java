/**
 * @File Name		: WXOpenUnionDaoImpl.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2017-6-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.common.dao.WXOpenUnionDao;
import com.fanglin.common.po.WXOpenUnionPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("wxOpenUnionDao")
public class WXOpenUnionDaoImpl extends DaoImpl<WXOpenUnionPO> implements WXOpenUnionDao {
	
	public WXOpenUnionDaoImpl(){
		super(WXOpenUnionPO.class);
	}
	
	@Override
	public WXOpenUnionPO queryWxOpenUnion(String openId) {
		return (WXOpenUnionPO) session().createCriteria(WXOpenUnionPO.class).add(Restrictions.eq(WXOpenUnionPO.COLUMN_OPENID_STR, openId)).uniqueResult();
	}

	@Override
	public WXOpenUnionPO queryWxOpenUnion(String unionId, short type) {
		return (WXOpenUnionPO) session().createCriteria(WXOpenUnionPO.class).add(Restrictions.eq(WXOpenUnionPO.COLUMN_UNIONID_STR, unionId)).add(Restrictions.eq(WXOpenUnionPO.COLUMN_TYPE_STR, type)).uniqueResult();
	}

	@Override
	public WXOpenUnionPO queryWxOpenUnion(String unionId, short type, int company) {
		return (WXOpenUnionPO) session().createCriteria(WXOpenUnionPO.class).add(Restrictions.eq(WXOpenUnionPO.COLUMN_UNIONID_STR, unionId)).add(Restrictions.eq(WXOpenUnionPO.COLUMN_TYPE_STR, type)).add(Restrictions.eq(WXOpenUnionPO.COLUMN_COMPANY_STR, company)).uniqueResult();
	}

}
