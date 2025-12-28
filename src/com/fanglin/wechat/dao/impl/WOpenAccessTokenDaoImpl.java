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

package com.fanglin.common.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.common.dao.WOpenAccessTokenDao;
import com.fanglin.common.po.WOpenAccessTokenPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("wOpenAccessTokenDao")
public class WOpenAccessTokenDaoImpl extends DaoImpl<WOpenAccessTokenPO> implements WOpenAccessTokenDao {
	
	public WOpenAccessTokenDaoImpl(){
		super(WOpenAccessTokenPO.class);
	}

	@Override
	public WOpenAccessTokenPO queryWOpenAccessTokenByCode(String code) {
		return (WOpenAccessTokenPO) session().createCriteria(WOpenAccessTokenPO.class).add(Restrictions.eq(WOpenAccessTokenPO.COLUMN_CODE_STR, code)).uniqueResult();
	}

	@Override
	public int deleteWOpenAccessTokenByOperateTime(long operateTime) {

		String sql = "delete from hades.wopenaccesstoken where operateTime < :operateTime";
		session().createSQLQuery(sql).setLong("operateTime", operateTime).executeUpdate();
		
		return 0;
	}
	
}
