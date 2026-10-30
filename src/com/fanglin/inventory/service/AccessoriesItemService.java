package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;

public interface AccessoriesItemService {

	public List<AccessoriesItemVO> queryAccessoriesItemByAid(AccessoriesItemVO accessoriesItemVO);

	public List<AccessoriesItemVO> queryAccessoriesItemByAids(List<Long> aids);

	public List<AccessoriesItemVO> queryAccessoriesItemByOrderId(AccessoriesVO accessoriesVO);

	public long checkAccessoriesItem(AccessoriesVO accessoriesVO, AccessoriesItemVO accessoriesItemVO) throws FLException;

	public long amountAccessoriesCharge(AccessoriesPO accessoriesPO);

	/**
	 * 重算辅料单费用额（费用行Σ优先, 无行回退模板现算）
	 * @param accessoriesPO 辅料单
	 * @return 主单费用额（厘）
	 */
	public long refreshAccessoriesCharge(AccessoriesPO accessoriesPO);

	/**
	 * 结算额公式计算: Σ(辅材结算价data.aoods.balance×辅料项数量)
	 * @param accessoriesPO 辅料单
	 * @return 结算额（厘）
	 */
	public long amountAccessoriesBalance(AccessoriesPO accessoriesPO);

	public int addAccessoriesItem(AccessoriesVO accessoriesVO, AccessoriesItemVO accessoriesItemVO) throws FLException;

	public int updateAccessoriesItem(AccessoriesItemVO accessoriesItemVO) throws FLException;

	public int deleteAccessoriesItem(AccessoriesItemVO accessoriesItemVO) throws FLException;

}
