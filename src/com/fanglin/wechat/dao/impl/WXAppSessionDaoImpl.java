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

package com.fanglin.common.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.common.dao.WXAppSessionDao;
import com.fanglin.common.po.WXAppSessionPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("wxAppSessionDao")
public class WXAppSessionDaoImpl extends DaoImpl<WXAppSessionPO> implements WXAppSessionDao {

	public WXAppSessionDaoImpl(){
		super(WXAppSessionPO.class);
	}

	@Override
	public WXAppSessionPO queryWxAppSessionByCode(String code) {
		return (WXAppSessionPO) session().createCriteria(WXAppSessionPO.class).add(Restrictions.eq(WXAppSessionPO.COLUMN_CODE_STR, code)).uniqueResult();
	}

	@Override
	public WXAppSessionPO queryWxAppSessionByOpenid(String openId) {
		return (WXAppSessionPO) session().createCriteria(WXAppSessionPO.class).add(Restrictions.eq(WXAppSessionPO.COLUMN_OPENID_STR, openId)).uniqueResult();
	}

	@Override
	public int deleteWxAppSession(long operateTime) {
		
		String sql = "delete from hades.wxappsession where operateTime < :operateTime";
		session().createSQLQuery(sql).setLong("operateTime", operateTime).executeUpdate();
		
		return 0;
	}

}
