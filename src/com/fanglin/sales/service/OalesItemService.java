package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.OalesItemVO;
import com.fanglin.sales.vo.OalesVO;
import com.fanglin.utils.Paging;

/**
 * 其他销售单项目明细 Service 接口
 */
public interface OalesItemService {

	/**
	 * 分页查询外销单项目明细
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param oalesItemVO 外销单项目明细VO（包含oid）
	 * @return 项目明细列表
	 * @throws FLException
	 */
	public List<OalesItemVO> pageOalesItem(Paging paging, List<Filter> filters, OalesItemVO oalesItemVO) throws FLException;

	/**
	 * 查询外销单的所有项目明细
	 * @param oalesItemVO 外销单项目明细VO（包含oid）
	 * @return 项目明细列表
	 */
	public List<OalesItemVO> queryOalesItem(OalesItemVO oalesItemVO);

	/**
	 * 添加外销单项目明细
	 * @param oalesVO 外销单VO
	 * @param oalesItemVO 外销单项目明细VO
	 * @return 处理结果
	 * @throws FLException
	 */
	public int addOalesItem(OalesVO oalesVO, OalesItemVO oalesItemVO) throws FLException;

	/**
	 * 删除外销单项目明细
	 * @param oalesItemVO 外销单项目明细VO
	 * @return 处理结果
	 * @throws FLException
	 */
	public int deleteOalesItem(OalesItemVO oalesItemVO) throws FLException;
}
