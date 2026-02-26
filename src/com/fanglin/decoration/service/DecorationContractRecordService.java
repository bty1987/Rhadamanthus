package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.decoration.vo.DecorationContractRecordVO;

public interface DecorationContractRecordService {

	/**
	 * 根据订单ID查询合同记录
	 * @param orderId 订单ID
	 * @return 合同记录列表
	 */
	public List<DecorationContractRecordVO> queryDecorationContractRecord(String orderId);

	/**
	 * 更新或创建合同记录(根据orderId判断存在则更新，不存在则创建)
	 * @param decorationContractRecordVO 合同记录
	 */
	public void updateDecorationContract(DecorationContractRecordVO decorationContractRecordVO);

}
