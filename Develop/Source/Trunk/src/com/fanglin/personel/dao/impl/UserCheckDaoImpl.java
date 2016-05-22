/**
 * @File Name		: UserCheckDaoImpl.java
 * @Package   	: com.fanglin.personel.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-8-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.UserCheckDao;
import com.fanglin.personel.po.UserCheckPO;
import com.fanglin.utils.DateUtil;

@Repository("userCheckDao")
public class UserCheckDaoImpl extends DaoImpl<UserCheckPO> implements UserCheckDao {
	
	public UserCheckDaoImpl(){
		super(UserCheckPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserCheckPO> queryUserCheckByUserIdACheckTime(String userId, String checkDate) {
		
		Timestamp startTimestamp = DateUtil.getDateToTimestamp(DateUtil.parseDate(checkDate + " 00:00:00", "yyyy-MM-dd HH:mm:ss"));
		Timestamp endTimestamp = DateUtil.getDateToTimestamp(DateUtil.parseDate(checkDate + " 23:59:59", "yyyy-MM-dd HH:mm:ss"));
		
		return session().createCriteria(UserCheckPO.class).add(Restrictions.eq(UserCheckPO.COLUMN_USERID_STR, userId)).add(Restrictions.ge(UserCheckPO.COLUMN_CHECKTIME_STR, startTimestamp)).add(Restrictions.le(UserCheckPO.COLUMN_CHECKTIME_STR, endTimestamp)).list();
	}

	@Override
	public int countUserCheckByUserIdACheckTime(String userId, String checkDate) {
		
		String startTime = checkDate + " 00:00:00";
		String endTime = checkDate + " 23:59:59";
		
		String sql = "select count(ucId) from platform.usercheck where userId = :userId and checkTime > :startTime and checkTime < :endTime";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("userId", userId).setString("startTime", startTime).setString("endTime", endTime).uniqueResult();
		
		return count.intValue();
	}

}
