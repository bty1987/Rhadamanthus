/**
 * @File Name		: StorehouseUserDao.java
 * @Package   	: com.fanglin.inventory.dao
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.StorehouseUserPO;

public interface StorehouseUserDao extends Dao<StorehouseUserPO> {
	
	public List<StorehouseUserPO> queryStorehouseUserByUId(int uId);
	
	public List<StorehouseUserPO> queryStorehouseUserByUserId(String userId);
	
	public int countStorehouseUserByShId(long shId);
	
	public int deleteStorehouseUserByUId(int uId);

}
