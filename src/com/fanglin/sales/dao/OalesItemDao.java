package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.OalesItemPO;
import com.fanglin.utils.Paging;

/**
 * 其他销售单项目明细 DAO 接口
 */
public interface OalesItemDao extends Dao<OalesItemPO> {

	/**
	 * 分页查询外销单项目明细
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param oid 外销单ID
	 * @return 项目明细列表
	 * @throws FLException
	 */
	public List<OalesItemPO> pageOalesItem(Paging paging, List<Filter> filters, long oid) throws FLException;

	/**
	 * 查询外销单的所有项目明细
	 * @param oid 外销单ID
	 * @return 项目明细列表
	 */
	public List<OalesItemPO> queryOalesItem(long oid);

	/**
	 * 计算外销单项目明细总金额
	 * @param oid 外销单ID
	 * @return 总金额
	 */
	public Long amountOalesItem(long oid);
}
