package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.customer.vo.VustomerNetVO;

public interface VustomerNetService {

	public List<?> countVustomerNetByUnionId(VustomerNetVO vustomerNetVO);

	public int buildVustomerNet(VustomerNetVO vustomerNetVO);

}
