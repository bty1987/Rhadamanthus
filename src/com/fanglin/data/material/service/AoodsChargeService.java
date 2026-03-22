package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.AoodsChargeVO;
import com.fanglin.utils.Paging;

public interface AoodsChargeService {

	/**
	 * 分页查询辅材费用列表
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param aid 辅材ID
	 */
	public void pageAoodsCharge(Paging paging, List<Filter> filters, Long aid);

	/**
	 * 根据辅材ID查询辅材费用列表
	 * @param aoodsChargeVO 辅材费用VO（包含 aid 和 type 参数）
	 * @return 辅材费用列表
	 */
	public List<AoodsChargeVO> queryAoodsChargeByAid(AoodsChargeVO aoodsChargeVO);

	/**
	 * 添加辅材费用
	 * @param aoodsChargeVO 辅材费用VO
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	public int addAoodsCharge(AoodsChargeVO aoodsChargeVO) throws FLException;

	/**
	 * 更新辅材费用
	 * @param aoodsChargeVO 辅材费用VO
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	public int updateAoodsCharge(AoodsChargeVO aoodsChargeVO) throws FLException;

	/**
	 * 删除辅材费用
	 * @param aoodsChargeVO 辅材费用VO
	 * @return 影响行数
	 */
	public int deleteAoodsCharge(AoodsChargeVO aoodsChargeVO);

}
