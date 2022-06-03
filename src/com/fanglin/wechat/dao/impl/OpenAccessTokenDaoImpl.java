/**
 * @File Name		: WOpenAccessTokenDaoImpl.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-6-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.wechat.dao.OpenAccessTokenDao;
import com.fanglin.wechat.po.OpenAccessTokenPO;

@Repository("openAccessTokenDao")
public class OpenAccessTokenDaoImpl extends DaoImpl<OpenAccessTokenPO> implements OpenAccessTokenDao {

	public OpenAccessTokenDaoImpl() {
		super(OpenAccessTokenPO.class);
	}

	@Override
	public OpenAccessTokenPO queryOpenAccessToken(String code) {
		return (OpenAccessTokenPO) session().createCriteria(OpenAccessTokenPO.class).add(Restrictions.eq(OpenAccessTokenPO.COLUMN_CODE_STR, code)).uniqueResult();
	}

	@Override
	public int deleteOpenAccessToken(long operateTime) {

		String sql = "delete from hades.wopenaccesstoken where operateTime < :operateTime";
		session().createSQLQuery(sql).setLong("operateTime", operateTime).executeUpdate();

		return 0;
	}

}
