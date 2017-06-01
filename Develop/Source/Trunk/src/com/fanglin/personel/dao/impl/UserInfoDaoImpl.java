/**
 * @File Name		: UserInfoDaoImpl.java
 * @Package   	: com.fanglin.personel.dao.impl
 * @Version		: 1.0
 * @Date			: 2017-6-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.po.UserInfoPO;

@Repository("userInfoDao")
public class UserInfoDaoImpl extends DaoImpl<UserInfoPO> implements UserInfoDao {
	
	public UserInfoDaoImpl(){
		super(UserInfoPO.class);
	}
	
	@Override
	public UserInfoPO queryUserInfoByUserId(String userId) {
		return (UserInfoPO) session().createCriteria(UserInfoPO.class).createAlias("user", "user").add(Restrictions.eq("user.userId", userId)).uniqueResult();
	}

}
