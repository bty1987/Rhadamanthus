package com.fanglin.decoration.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationScaleDetailPO;

public interface DecorationScaleDetailDao extends Dao<DecorationScaleDetailPO> {

	/**
	 * 券是否已被有效收款占用(一券一用并发兜底)
	 */
	public int countDecorationScaleDetailByDaiId(long daiId);

	/**
	 * 该装修单的配比净额调整额(厘, 有符号): 计入券净额0(已随referMoney视同已收), 不计入券净额-money(从基数剔除)
	 */
	public long amountDecorationScaleDetailForScale(String orderId);

	/**
	 * 该收款行是否含有效配比明细(删除链守卫)
	 */
	public int countDecorationScaleDetailBySpid(long spid);

	/**
	 * 该装修单是否已有有效配比明细(每单一张守卫)
	 */
	public int countDecorationScaleDetailByOrderId(String orderId);

}
