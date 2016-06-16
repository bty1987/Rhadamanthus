/**
 * @File Name		: LoginInfoDao.java
 * @Package   	: com.fanglin.common.dao
 * @Version		: 1.0
 * @Date			: 2016-5-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.dao;

import com.fanglin.common.po.LoginInfoPO;
import com.fanglin.core.dao.Dao;

public interface LoginInfoDao extends Dao<LoginInfoPO> {
	
	public LoginInfoPO queryLoginInfoByLoginFlag(String loginFlag);
	
	public int deleteLoginInfoByOptime(long optime);

}
