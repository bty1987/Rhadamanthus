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

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.utils.Paging;

public interface UserInfoDao extends Dao<UserInfoPO> {

	public List<UserInfoPO> pageUserInfo(Paging paging, List<Filter> filters, Integer company);
	
	public UserInfoPO queryUserInfoByUserId(String userId);

	public int countUserInfoByEmail(String email, String userId);

}
