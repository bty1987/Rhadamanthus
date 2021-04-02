/**
 * @File Name		: ServerDao.java
 * @Package   	: com.fanglin.system.dao
 * @Version		: 1.0
 * @Date			: 2017-8-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.factory.po.ServerPO;

public interface ServerDao extends Dao<ServerPO>{
	
	public List<ServerPO> queryServerByCompany(int company);

}
