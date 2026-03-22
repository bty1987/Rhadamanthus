package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.OccessoriesChargeVO;

public interface OccessoriesChargeService {

	/**
	 * 查询外辅费用列表（支持按oid或oiid查询）
	 * @param occessoriesChargeVO 查询条件
	 * @return 费用列表
	 */
	public List<OccessoriesChargeVO> queryOccessoriesCharge(OccessoriesChargeVO occessoriesChargeVO);

	/**
	 * 添加外辅费用
	 * @param occessoriesChargeVO 费用信息
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	public int addOccessoriesCharge(OccessoriesChargeVO occessoriesChargeVO) throws FLException;

	/**
	 * 更新外辅费用
	 * @param occessoriesChargeVO 费用信息
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	public int updateOccessoriesCharge(OccessoriesChargeVO occessoriesChargeVO) throws FLException;

	/**
	 * 删除外辅费用
	 * @param occessoriesChargeVO 费用信息（需包含acid）
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	public int deleteOccessoriesCharge(OccessoriesChargeVO occessoriesChargeVO) throws FLException;

	/**
	 * 批量保存外辅费用（删除旧数据 + 批量插入新数据）
	 * @param occessoriesChargeVO 外辅费用信息（需包含occessories.oid）
	 * @param occessoriesCharges 费用列表
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	public int batchOccessoriesCharge(OccessoriesChargeVO occessoriesChargeVO, List<OccessoriesChargeVO> occessoriesCharges) throws FLException;

}
