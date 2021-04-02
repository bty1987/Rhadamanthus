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

package com.fanglin.factory.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.factory.po.LoginInfoPO;

public interface LoginInfoDao extends Dao<LoginInfoPO> {

	public LoginInfoPO queryLoginInfoByLoginFlag(String loginFlag);

	public int deleteLoginInfoByOptime(long optime);

}
