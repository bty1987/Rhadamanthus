/**
 * @File Name		: WeChatOpenAccessTokenDaoImpl.java
 * @Package   	: com.fanglin.wechat.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-6-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信 Open AccessToken DAO 实现类
 */

package com.fanglin.wechat.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.wechat.dao.WeChatOpenAccessTokenDao;
import com.fanglin.wechat.po.WeChatOpenAccessTokenPO;

@Repository("weChatOpenAccessTokenDao")
public class WeChatOpenAccessTokenDaoImpl extends DaoImpl<WeChatOpenAccessTokenPO> implements WeChatOpenAccessTokenDao {

	public WeChatOpenAccessTokenDaoImpl() {
		super(WeChatOpenAccessTokenPO.class);
	}

	@Override
	public WeChatOpenAccessTokenPO queryOpenAccessToken(String code) {
		return (WeChatOpenAccessTokenPO) session().createCriteria(WeChatOpenAccessTokenPO.class).add(Restrictions.eq(WeChatOpenAccessTokenPO.COLUMN_CODE_STR, code)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deleteOpenAccessToken(long operateTime) {

		String sql = "delete from hades.wopenaccesstoken where operateTime < :operateTime";
		session().createSQLQuery(sql).setLong("operateTime", operateTime).executeUpdate();

		return 0;
	}

}
