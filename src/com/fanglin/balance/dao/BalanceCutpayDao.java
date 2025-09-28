package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceCutpayPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceCutpayDao extends Dao<BalanceCutpayPO> {

	public List<BalanceCutpayPO> pageBalanceCutpay(Paging paging, List<Filter> filters);

	public List<BalanceCutpayPO> queryBalanceCutpay(long bid);

	public List<BalanceCutpayPO> queryBalanceCutpayByOuid(int ouid);

	public long amountBalanceCutpay(long bid);
}
