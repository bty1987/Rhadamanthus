package com.fanglin.decoration.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationScaleDetailPO;

public interface DecorationScaleDetailDao extends Dao<DecorationScaleDetailPO> {

	/**
	 * 券是否已被有效收款占用(一券一用并发兜底)
	 */
	public int countDecorationScaleDetailByDaiId(long daiId);

	/**
	 * 该装修单计入配比的券金额合计(厘)
	 */
	public long amountDecorationScaleDetailForScale(String orderId);

}
