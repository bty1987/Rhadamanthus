/**
 * @File Name		: MaterialBrandRightDaoImpl.java
 * @Package   	: com.fanglin.dao.materialOrder.impl
 * @Version		: 1.0
 * @Date			: 2015-3-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.BrandUserRightDao;
import com.fanglin.data.po.BrandUserRightPO;

@Repository("brandRightDao")
public class BrandUserRightDaoImpl extends DaoImpl<BrandUserRightPO> implements BrandUserRightDao {

	public BrandUserRightDaoImpl(){
		super(BrandUserRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandUserRightPO> queryBrandUserRightByUserId(String userId){
		return createCriteria(BrandUserRightPO.class).createAlias("user", "user").add(Restrictions.eq(BrandUserRightPO.COLUMN_USERID_STR, userId)).list();
	}

	@Override
	public int deleteBrandUserRightByUserId(String userId) {
		
		String sql = "delete from communion.branduserright where userId in :userId";
		session().createSQLQuery(sql).setString("userId", userId).executeUpdate();
		
		return 0;
	}

}
