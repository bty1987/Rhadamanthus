/**
 * @File Name		: WXAppSessionDaoImpl.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2017-5-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.wechat.po.WeChatAppSessionPO;

@Repository("wxAppSessionDao")
public class WeChatAppSessionDaoImpl extends DaoImpl<WeChatAppSessionPO> implements WeChatAppSessionDao {

	public WeChatAppSessionDaoImpl() {
		super(WeChatAppSessionPO.class);
	}

	@Override
	public WeChatAppSessionPO queryWeChatAppSessionByCode(String code) {
		return (WeChatAppSessionPO) session().createCriteria(WeChatAppSessionPO.class).add(Restrictions.eq(WeChatAppSessionPO.COLUMN_CODE_STR, code)).uniqueResult();
	}

	@Override
	public WeChatAppSessionPO queryWeChatAppSessionByOpenid(String openId) {
		return (WeChatAppSessionPO) session().createCriteria(WeChatAppSessionPO.class).add(Restrictions.eq(WeChatAppSessionPO.COLUMN_OPENID_STR, openId)).uniqueResult();
	}

	@Override
	public int deleteWeChatAppSession(long operateTime) {

		String sql = "delete from hades.wechatappsession where operateTime < :operateTime";
		session().createSQLQuery(sql).setLong("operateTime", operateTime).executeUpdate();

		return 0;
	}

}
