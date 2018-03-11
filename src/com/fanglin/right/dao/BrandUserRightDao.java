/**
 * @File Name		: MaterialBrandRightDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2015-3-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.right.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.BrandUserRightPO;

public interface BrandUserRightDao extends Dao<BrandUserRightPO> {
	
	public BrandUserRightPO queryBrandUserRightByUid(int uid);

}
