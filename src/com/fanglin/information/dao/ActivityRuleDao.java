/**
 * @File Name		: ActivityRuleDao.java
 * @Package   	: com.fanglin.information.dao
 * @Version		: 1.0
 * @Date			: 2026-10-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 活动奖励规则 DAO (一行一档位)
 */

package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.information.po.ActivityRulePO;

public interface ActivityRuleDao extends Dao<ActivityRulePO> {

	/**
	 * 查活动的启用规则行 (status=启用, 按 sort, arId 排序)
	 */
	public List<ActivityRulePO> queryActivityRuleForEnabled(long aid);
}
