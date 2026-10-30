package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.AccessoriesChargeVO;

public interface AccessoriesChargeService {

	/**
	 * 查询辅料费用列表（支持按aid或aiid查询）
	 * @param accessoriesChargeVO 查询条件
	 * @return 费用列表
	 */
	public List<AccessoriesChargeVO> queryAccessoriesCharge(AccessoriesChargeVO accessoriesChargeVO);

	/**
	 * 添加辅料费用
	 * @param accessoriesChargeVO 费用信息
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	public int addAccessoriesCharge(AccessoriesChargeVO accessoriesChargeVO) throws FLException;

	/**
	 * 更新辅料费用
	 * @param accessoriesChargeVO 费用信息
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	public int updateAccessoriesCharge(AccessoriesChargeVO accessoriesChargeVO) throws FLException;

	/**
	 * 删除辅料费用
	 * @param accessoriesChargeVO 费用信息（需包含acid）
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	public int deleteAccessoriesCharge(AccessoriesChargeVO accessoriesChargeVO) throws FLException;

	/**
	 * 批量保存辅料费用（删除旧数据 + 批量插入新数据）
	 * @param accessoriesChargeVO 辅料费用信息（需包含accessories.aid）
	 * @param accessoriesCharges 费用列表
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	public int batchAccessoriesCharge(AccessoriesChargeVO accessoriesChargeVO, List<AccessoriesChargeVO> accessoriesCharges) throws FLException;

}
