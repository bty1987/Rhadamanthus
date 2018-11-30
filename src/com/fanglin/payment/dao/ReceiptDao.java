package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.ReceiptPO;
import com.fanglin.utils.Paging;

public interface ReceiptDao extends Dao<ReceiptPO> {

	public List<ReceiptPO> pageReceipt(Paging paging, List<Filter> filters, int company);

}
