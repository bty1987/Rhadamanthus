/**
 * @File Name		: WeChatUserInfoDaoImpl.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2017-6-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.wechat.po.WeChatUserInfoPO;

@Repository("weChatUserInfoDao")
public class WeChatUserInfoDaoImpl extends DaoImpl<WeChatUserInfoPO> implements WeChatUserInfoDao {

	public WeChatUserInfoDaoImpl() {
		super(WeChatUserInfoPO.class);
	}

	@Override
	public WeChatUserInfoPO queryWeChatUserInfoByUnionId(String unionId) {
		return (WeChatUserInfoPO) session().createCriteria(WeChatUserInfoPO.class).add(Restrictions.eq(WeChatUserInfoPO.COLUMN_UNIONID_STR, unionId)).uniqueResult();
	}

}
