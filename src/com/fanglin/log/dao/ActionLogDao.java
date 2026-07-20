/**
 * @File Name		:  ActionLogDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.log.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.utils.Paging;

public interface ActionLogDao extends Dao<ActionLogPO> {

	List<ActionLogPO> getPageActionLogPOs(Paging paging, List<Filter> filters);

	List<ActionLogPO> getAllPageActionLogPOs(List<Filter> filters);

	/**
	 * Phase 4.3: 查询热表+指定归档月表的 UNION 结果。
	 *
	 * <p>调用方（LogService）会先计算涉及的归档表月份列表（白名单校验过），
	 * 传入 archiveMonths（格式 yyyyMM）。本方法动态构造 SQL：
	 *   SELECT * FROM log.actionlog WHERE [filters]
	 *   UNION ALL
	 *   SELECT * FROM log.actionlog_202605 WHERE [filters]
	 *   UNION ALL
	 *   SELECT * FROM log.actionlog_202604 WHERE [filters]
	 *   ORDER BY createTime DESC
	 *   LIMIT ?,?
	 *
	 * @param archiveMonths 归档月份列表（已校验 ^\d{6}$），空列表则只查热表
	 * @param paging        分页对象
	 * @param filters       过滤条件
	 * @return 合并后的结果集（已分页排序）
	 */
	List<ActionLogPO> getPageActionLogPOsWithHistory(List<String> archiveMonths, Paging paging, List<Filter> filters);

	/**
	 * Phase 4.3: 统计热表+归档表 UNION 结果总数（用于分页 total）。
	 */
	long countActionLogPOsWithHistory(List<String> archiveMonths, List<Filter> filters);

}
