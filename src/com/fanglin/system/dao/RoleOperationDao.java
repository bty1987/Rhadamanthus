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

	public List<RoleOperationPO> queryRoleOperationByRid(int rid);

	public List<RoleOperationPO> queryRoleOperation(List<Integer> rids);

	public RoleOperationPO queryRoleOperation(String operation, int rid);

	public RoleOperationPO queryRoleOperation(int rid, int oid);

	public RoleOperationPO queryRoleOperation(List<Integer> rids, int oid);

	public int countRoleOperationByOid(int oid);

	public int deleteRoleOperationByRid(int rid);

	public int deleteRoleOperationByOId(int oId);

}
