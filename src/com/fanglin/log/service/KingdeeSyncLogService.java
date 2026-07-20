package com.fanglin.log.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.vo.KingdeeSyncLogVO;
import com.fanglin.utils.Paging;

public interface KingdeeSyncLogService {

	/**
	 * 分页查询金蝶同步日志。
	 */
	void pageKingdeeSyncLog(Paging paging, List<Filter> filters);

	/**
	 * 记录一条金蝶同步日志。
	 *
	 * <p>注意：当前金蝶业务流程并未调用此方法（原 addKingdeeRecord 也是僵尸功能）。
	 * 本次整合仅迁移代码骨架，后续如需在凭证推送/回查/删除等场景补写入点，
	 * 调用本方法即可。
	 *
	 * @param orderId 装修订单号
	 * @param rtid 收据ID
	 * @param atttype 属性/收款类型
	 * @param type 款项类型
	 * @param message 同步结果/错误信息
	 * @param userId 操作人账号
	 */
	int addKingdeeSyncLog(String orderId, long rtid, short atttype, String type, String message, String userId);

}
