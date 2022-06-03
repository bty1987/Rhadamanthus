package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.utils.Paging;

public interface PaytranDao extends Dao<PaytranPO> {

	public List<PaytranPO> pagePaytran(Paging paging, List<Filter> filters);

	public List<PaytranPO> queryPaytran(String orderId, Short type, Long rid, Long pid);

	// 这里接口原本没有rid, 是后增加的, 应该是根据当前收据对应的推送信息更新而不是全部更新
	public void updatePaytran(List<Long> ptids, Long rid, Short status, Short type);

	public long countPaytran(String sn, Short status);

	public int countPaytranByPtids(List<Long> ptids);

}
