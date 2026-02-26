package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationServiceVO;
import com.fanglin.utils.Paging;

public interface DecorationServiceService {

	public void pageDecorationService(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public List<DecorationServiceVO> queryDecorationServiceByOrderId(DecorationServiceVO decorationServiceVO);

	public int addDecortionService(DecorationServiceVO decorationServiceVO, Authentication authentication) throws FLException;

	public int completeDecorationService(DecorationServiceVO decorationServiceVO) throws FLException;

	// ==================== 设计确认相关方法 ====================

	/**
	 * 创建设计确认记录
	 */
	public long createDesignConfirmationForPictureByOrderId(DecorationServiceVO serviceVO, Authentication authentication) throws FLException;

	/**
	 * 提交设计确认
	 */
	public void submitDesignConfirmationForResultByDsid(DecorationServiceVO serviceVO, Authentication authentication) throws FLException;

	/**
	 * 查询设计确认历史
	 */
	public List<DecorationServiceVO> queryDesignConfirmationHistoryForByOrderId(String orderId);

	/**
	 * 切换图片确认展示状态
	 */
	public void toggleDecorationPictureForShowStatusByOrderIdAndDpid(String orderId, Long dpid, short status) throws FLException;

	/**
	 * 批量切换图片展示状态
	 */
	public int batchToggleDecorationPictureForShowStatusByOrderIdAndDpids(String orderId, String dpidStr, short status) throws FLException;

}
