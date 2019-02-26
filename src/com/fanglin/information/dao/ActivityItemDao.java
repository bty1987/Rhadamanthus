/**
 * @File Name		: ActivityItemDao.java
 * @Package   	: com.fanglin.information.dao
 * @Version		: 1.0
 * @Date			: 2015-11-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.information.po.ActivityItemPO;

public interface ActivityItemDao extends Dao<ActivityItemPO> {
	
	public List<ActivityItemPO> queryActivityItemByAid(long aId);
	
}
