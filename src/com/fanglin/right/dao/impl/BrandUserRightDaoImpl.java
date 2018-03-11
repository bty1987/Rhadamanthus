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

package com.fanglin.right.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.BrandUserRightDao;
import com.fanglin.right.po.BrandUserRightPO;

@Repository("brandRightDao")
public class BrandUserRightDaoImpl extends DaoImpl<BrandUserRightPO> implements BrandUserRightDao {

	public BrandUserRightDaoImpl(){
		super(BrandUserRightPO.class);
	}

	@Override
	public BrandUserRightPO queryBrandUserRightByUid(int uid){
		
		return (BrandUserRightPO) createCriteria(BrandUserRightPO.class).add(Restrictions.eq(BrandUserRightPO.COLUMN_UID_STR, uid)).uniqueResult();
		
	}

}
