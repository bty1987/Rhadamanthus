/**
 * @File Name		: UserInfoDao.java
 * @Package   	: com.fanglin.personel.dao
 * @Version		: 1.0
 * @Date			: 2017-6-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserInfoPO;

public interface UserInfoDao extends Dao<UserInfoPO> {
	
	public UserInfoPO queryUserInfoByUserId(String userId);

}
