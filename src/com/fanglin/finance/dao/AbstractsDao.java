/**
 * @File Name		: AbstractsDao.java
 * @Package   	: com.fanglin.finance.dao
 * @Version		: 1.0
 * @Date			: 2016-4-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.finance.po.AbstractsPO;

public interface AbstractsDao extends Dao<AbstractsPO> {
	
	public List<AbstractsPO> queryAbstractsByOwnerId(int ownerId);
	
	public int countAbstractsByOwnerId(int ownerId);
	
}
