/**
 * @File Name		: WXUserInfoDaoImpl.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2017-6-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.common.dao.WXUserInfoDao;
import com.fanglin.common.po.WXUserInfoPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("wxUserInfoDao")
public class WXUserInfoDaoImpl extends DaoImpl<WXUserInfoPO> implements WXUserInfoDao {

	public WXUserInfoDaoImpl(){
		super(WXUserInfoPO.class);
	}

	@Override
	public WXUserInfoPO queryWxUserInfoByUnionId(String unionId) {
		return (WXUserInfoPO) session().createCriteria(WXUserInfoPO.class).add(Restrictions.eq(WXUserInfoPO.COLUMN_UNIONID_STR, unionId)).uniqueResult();
	}
	
}
