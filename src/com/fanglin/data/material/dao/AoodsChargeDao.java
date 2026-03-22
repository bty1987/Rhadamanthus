package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.AoodsChargePO;
import com.fanglin.utils.Paging;

public interface AoodsChargeDao extends Dao<AoodsChargePO> {

	/**
	 * 分页查询辅材费用列表
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param aid 辅材ID
	 * @return 辅材费用列表
	 */
	public List<AoodsChargePO> pageAoodsCharge(Paging paging, List<Filter> filters, Long aid);

	/**
	 * 根据辅材ID查询辅材费用列表
	 * @param aid 辅材ID
	 * @param type 费用类型（可选：0-通用，1-超阶）
	 * @return 辅材费用列表
	 */
	public List<AoodsChargePO> queryAoodsChargeByAid(Long aid, Short type);

}
