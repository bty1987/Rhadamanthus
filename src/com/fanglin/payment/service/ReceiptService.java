package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ReceiptService {

	public void pageReceipt(Paging paging, List<Filter> filters, int company);

}
