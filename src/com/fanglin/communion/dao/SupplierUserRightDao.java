/**
 * @File Name		: SupplierUserRightDao.java
 * @Package   	: com.fanglin.data.dao
 * @Version		: 1.0
 * @Date			: 2016-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.SupplierUserRightPO;
import com.fanglin.core.dao.Dao;

public interface SupplierUserRightDao extends Dao<SupplierUserRightPO> {
	
	public List<SupplierUserRightPO> querySupplierUserRightBySId(long sId);
	
	public int deleteSupplierUserRightBySId(long sId);

}
