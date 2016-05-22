/**
 * @File Name		: CountingDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2015-1-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.dao;

import com.fanglin.common.po.CountingPO;
import com.fanglin.core.dao.Dao;

public interface CountingDao extends Dao<CountingPO>{
	
	public CountingPO queryCountingByTypeDate(int type, String Date);
	
}
