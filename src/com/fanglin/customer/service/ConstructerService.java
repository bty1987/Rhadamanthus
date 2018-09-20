package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.customer.vo.ConstructerVO;

public interface ConstructerService {
	
	public List<ConstructerVO> queryCusConstructer(String orderId,String unionId);

}
