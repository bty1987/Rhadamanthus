package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.BudgetUserRuleTypePO;

/**
 * 预算员类型支持表 DAO 接口
 */
public interface BudgetUserRuleTypeDao extends Dao<BudgetUserRuleTypePO> {

	/**
	 * 查询预算员支持的所有类型
	 * @param burid 预算员规则ID
	 * @return 类型列表
	 */
	List<Byte> findTypesByBurid(Integer burid);

	/**
	 * 检查预算员是否支持某个类型
	 * @param burid 预算员规则ID
	 * @param type 类型
	 * @return 是否支持
	 */
	boolean existsByBuridAndType(Integer burid, Byte type);

	/**
	 * 删除预算员的所有类型配置
	 * @param burid 预算员规则ID
	 * @return 影响行数
	 */
	int deleteByBurid(Integer burid);
}
