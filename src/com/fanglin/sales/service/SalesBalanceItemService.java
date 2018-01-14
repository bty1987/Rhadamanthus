package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.sales.vo.SalesBalanceItemVO;
import com.fanglin.sales.vo.SalesBalanceVO;

public interface SalesBalanceItemService {

	public List<SalesBalanceItemVO> querySalesBalanceItemBySbid(SalesBalanceVO salesBalanceVO);
	
}
