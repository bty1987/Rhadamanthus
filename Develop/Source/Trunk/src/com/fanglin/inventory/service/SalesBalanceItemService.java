package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.inventory.vo.SalesBalanceItemVO;
import com.fanglin.inventory.vo.SalesBalanceVO;

public interface SalesBalanceItemService {

	public List<SalesBalanceItemVO> querySalesBalanceItemBySbid(SalesBalanceVO salesBalanceVO);
	
}
