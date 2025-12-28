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

package com.fanglin.wechat.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.wechat.po.WeChatOpenUnionPO;

@Repository("wxOpenUnionDao")
public class WeChatOpenUnionDaoImpl extends DaoImpl<WeChatOpenUnionPO> implements WXOpenUnionDao {
	
	public WeChatOpenUnionDaoImpl(){
		super(WeChatOpenUnionPO.class);
	}
	
	@Override
	public WeChatOpenUnionPO queryWxOpenUnion(String openId) {
		return (WeChatOpenUnionPO) session().createCriteria(WeChatOpenUnionPO.class).add(Restrictions.eq(WeChatOpenUnionPO.COLUMN_OPENID_STR, openId)).uniqueResult();
	}

	@Override
	public WeChatOpenUnionPO queryWxOpenUnion(String unionId, short type) {
		return (WeChatOpenUnionPO) session().createCriteria(WeChatOpenUnionPO.class).add(Restrictions.eq(WeChatOpenUnionPO.COLUMN_UNIONID_STR, unionId)).add(Restrictions.eq(WeChatOpenUnionPO.COLUMN_TYPE_STR, type)).uniqueResult();
	}

	@Override
	public WeChatOpenUnionPO queryWxOpenUnion(String unionId, short type, int company) {
		return (WeChatOpenUnionPO) session().createCriteria(WeChatOpenUnionPO.class).add(Restrictions.eq(WeChatOpenUnionPO.COLUMN_UNIONID_STR, unionId)).add(Restrictions.eq(WeChatOpenUnionPO.COLUMN_TYPE_STR, type)).add(Restrictions.eq(WeChatOpenUnionPO.COLUMN_COMPANY_STR, company)).uniqueResult();
	}

}
