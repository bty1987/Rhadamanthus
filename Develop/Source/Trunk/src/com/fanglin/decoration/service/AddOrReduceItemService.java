package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.utils.Paging;


public interface AddOrReduceItemService {

	public void pageAddOrReduceItem(Paging paging, List<FilterVO> filters);

	public void pageAddOrReduceItemByPaymentId(Paging paging, List<FilterVO> filters, AddReduceVO addReduceVO);

}
