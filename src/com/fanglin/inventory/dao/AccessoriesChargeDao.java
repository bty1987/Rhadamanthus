package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.AccessoriesChargePO;

public interface AccessoriesChargeDao extends Dao<AccessoriesChargePO> {

	/**
	 * 根据辅料单ID查询费用列表
	 * @param aid 辅料单ID
	 * @return 费用列表
	 */
	public List<AccessoriesChargePO> queryAccessoriesChargeByAid(long aid);

	/**
	 * 根据辅料项ID查询费用列表
	 * @param aiid 辅料项ID
	 * @return 费用列表
	 */
	public List<AccessoriesChargePO> queryAccessoriesChargeByIid(long aiid);

}
