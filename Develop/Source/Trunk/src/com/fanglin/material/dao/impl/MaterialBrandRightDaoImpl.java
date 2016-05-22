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

package com.fanglin.material.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.material.dao.MaterialBrandRightDao;
import com.fanglin.material.po.MaterialBrandRightPO;

@Repository("materialBrandRightDao")
public class MaterialBrandRightDaoImpl extends DaoImpl<MaterialBrandRightPO> implements MaterialBrandRightDao {

	public MaterialBrandRightDaoImpl(){
		super(MaterialBrandRightPO.class);
	}

	@Override
	public MaterialBrandRightPO querymateriBrandRightByUserId(String userId){
		return (MaterialBrandRightPO) createCriteria(MaterialBrandRightPO.class).add(Restrictions.eq(MaterialBrandRightPO.COLUMN_USERID_STR, userId)).uniqueResult();
	}

}
