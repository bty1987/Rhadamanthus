package com.fanglin.log.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.vo.CustomerLogVO;
import com.fanglin.utils.Paging;

public interface CustomerLogService {

	/**
	 * 分页查询客户电话查询日志。
	 */
	void pageCustomerLog(Paging paging, List<Filter> filters);

	/**
	 * 记录一条客户电话查询日志。
	 *
	 * @param cid 客户ID
	 * @param cpid 客户电话ID（无具体电话时传 0）
	 * @param userId 操作人账号
	 * @param comment 备注（可空）
	 */
	int addCustomerLog(long cid, long cpid, String userId, String comment);

}
