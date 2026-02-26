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

}
