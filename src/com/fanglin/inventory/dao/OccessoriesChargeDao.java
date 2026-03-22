package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.OccessoriesChargePO;

public interface OccessoriesChargeDao extends Dao<OccessoriesChargePO> {

	/**
	 * 根据外辅单ID查询费用列表
	 * @param oid 外辅单ID
	 * @return 费用列表
	 */
	public List<OccessoriesChargePO> queryOccessoriesChargeByOid(long oid);

	/**
	 * 根据外辅项ID查询费用列表
	 * @param oiid 外辅项ID
	 * @return 费用列表
	 */
	public List<OccessoriesChargePO> queryOccessoriesChargeByOiid(long oiid);

}
