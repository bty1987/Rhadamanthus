package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.sales.vo.RefundsItemVO;
import com.fanglin.sales.vo.RefundsVO;


public interface RefundsItemService {

	public List<RefundsItemVO> queryRefundsItemBySid(RefundsVO refundsVO);
	
}
