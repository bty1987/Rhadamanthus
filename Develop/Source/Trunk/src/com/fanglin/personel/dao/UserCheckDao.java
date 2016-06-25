/**
 * @File Name		: UserCheckDao.java
 * @Package   	: com.fanglin.personel.dao
 * @Version		: 1.0
 * @Date			: 2015-8-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserCheckPO;

public interface UserCheckDao extends Dao<UserCheckPO> {
	
	public List<UserCheckPO> queryUserCheckByUserIdACheckTime(String userId, String checkDate);
	
	public int countUserCheckByUserIdACheckTime(String userId, String checkDate);

}
