package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationContractRecordPO;

public interface DecorationContractRecordDao extends Dao<DecorationContractRecordPO> {

	/**
	 * 根据订单ID查询合同记录
	 * @param orderId 订单ID
	 * @return 合同记录列表
	 */
	public List<DecorationContractRecordPO> queryDecorationContractRecord(String orderId);

}
