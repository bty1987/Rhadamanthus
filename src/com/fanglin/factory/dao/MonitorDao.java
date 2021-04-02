/**
 * @File Name		: MonitorDao.java
 * @Package   	: com.fanglin.monitor.dao
 * @Version		: 1.0
 * @Date			: 2017-9-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.factory.po.MonitorPO;

public interface MonitorDao extends Dao<MonitorPO>{
	
	public List<MonitorPO> queryMonitor();
	
	public MonitorPO queryMonitor(String name, String type);

}
