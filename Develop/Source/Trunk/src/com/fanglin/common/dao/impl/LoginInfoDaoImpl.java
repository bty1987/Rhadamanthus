/**
 * @File Name		: LoginInfoDaoImpl.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-5-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.common.dao.LoginInfoDao;
import com.fanglin.common.po.LoginInfoPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("loginInfoDao")
public class LoginInfoDaoImpl extends DaoImpl<LoginInfoPO> implements LoginInfoDao {
	
	public LoginInfoDaoImpl(){
		super(LoginInfoPO.class);
	}

	@Override
	public LoginInfoPO queryLoginInfoByLoginFlag(String loginFlag) {
		return (LoginInfoPO) session().createCriteria(LoginInfoPO.class).add(Restrictions.eq(LoginInfoPO.COLUMN_LOGINFLAG_STR, loginFlag)).uniqueResult();
	}

	@Override
	public int deleteLoginInfoByOptime(long optime) {
		
		String sql = "delete from platform.logininfo where optime < :optime and code = -1";
		session().createSQLQuery(sql).setLong("optime", optime).executeUpdate();
		
		return 0;
	}

}
