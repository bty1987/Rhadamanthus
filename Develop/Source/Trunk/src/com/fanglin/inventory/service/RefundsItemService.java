package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.inventory.vo.RefundsItemVO;
import com.fanglin.inventory.vo.RefundsVO;

public interface RefundsItemService {
		
		public List<RefundsItemVO> queryRefundsItemBySid(RefundsVO refundsVO);
}
