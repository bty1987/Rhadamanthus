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

	public List<RoleOperationPO> queryRoleOperationByRid(int rid, Integer company);

	public List<RoleOperationPO> queryRoleOperation(List<Integer> rids, Integer company);

	public RoleOperationPO queryRoleOperation(String operation, int rid, Integer company);

	public RoleOperationPO queryRoleOperation(int rid, int oid, Integer company);

	public RoleOperationPO queryRoleOperation(List<Integer> rids, int oid);

	public int countRoleOperationByOid(int oid, Integer company);

	public int deleteRoleOperationByRid(int rid, Integer company);

	public int deleteRoleOperationByOId(int oId, Integer company);

}
