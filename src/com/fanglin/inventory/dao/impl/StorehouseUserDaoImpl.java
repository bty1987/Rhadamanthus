/**
 * @File Name		: StorehouseUserDaoImpl.java
 * @Package   	: com.fanglin.inventory.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.StorehouseUserDao;
import com.fanglin.inventory.po.StorehouseUserPO;

@Repository("storehouseUserDao")
public class StorehouseUserDaoImpl extends DaoImpl<StorehouseUserPO> implements StorehouseUserDao {
	
	public StorehouseUserDaoImpl(){
		super(StorehouseUserPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<StorehouseUserPO> queryStorehouseUserByUId(int uId) {
		return session().createCriteria(StorehouseUserPO.class).createAlias("user", "user").add(Restrictions.eq(StorehouseUserPO.COLUMN_UID_STR, uId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<StorehouseUserPO> queryStorehouseUserByUserId(String userId) {
		return session().createCriteria(StorehouseUserPO.class).createAlias("user", "user").add(Restrictions.eq(StorehouseUserPO.COLUMN_USERID_STR, userId)).list();
	}

	@Override
	public int countStorehouseUserByShId(long shId) {
		
		String sql = "select count(*) from inventory.storehouseuser where shId = :shId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("shId", shId).uniqueResult();
		
		return count.intValue();
	}

	@Override
	public int deleteStorehouseUserByUId(int uId) {
		
		String sql = "delete from inventory.storehouseuser where uid = :uid";
		session().createSQLQuery(sql).setInteger("uid", uId).executeUpdate();
		
		return 0;
	}

}
