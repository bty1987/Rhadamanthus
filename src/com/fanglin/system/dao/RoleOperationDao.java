/**
 * @File Name		: RoleOperationDao.java
 * @Package   	: com.fanglin.system.dao
 * @Version		: 1.0
 * @Date			: 2016-9-12
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.system.po.RoleOperationPO;

public interface RoleOperationDao extends Dao<RoleOperationPO> {
	
	public List<RoleOperationPO> queryRoleOperationByRId(int rId, short system);
	
	public RoleOperationPO queryRoleOperationByOperationName(String operationName, short system);
	
	public RoleOperationPO queryRoleOperationByOperationARId(String operation, int rId, short system);
	
	public RoleOperationPO queryRoleOperationByRIdAOId(int rId, int oId);
	
	public int deleteRoleOperationByRId(int rId, short system);
	
}
