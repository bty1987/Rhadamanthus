package com.fanglin.log.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.vo.DecorationPictureLogVO;
import com.fanglin.utils.Paging;

public interface DecorationPictureLogService {

	/**
	 * 分页查询图纸下载日志。
	 */
	void pageDecorationPictureLog(Paging paging, List<Filter> filters);

	/**
	 * 记录一条图纸下载日志。
	 *
	 * @param dpId 图纸/合同文件ID
	 * @param orderId 装修订单号（可空）
	 * @param userId 操作人账号
	 */
	int addDecorationPictureLog(long dpId, String orderId, String userId);

}
