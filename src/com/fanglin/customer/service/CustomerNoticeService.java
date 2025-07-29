package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerNoticeVO;
import com.fanglin.utils.Paging;

public interface CustomerNoticeService {

	public void pageCustomerNotice(Paging paging, List<Filter> filters, CustomerNoticeVO customerNoticeVO);

}
