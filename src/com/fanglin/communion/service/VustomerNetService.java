package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.VustomerNetVO;

public interface VustomerNetService {
	
	public List<?> countVustomerNetByUnionId(VustomerNetVO vustomerNetVO);
	
	public int buildVustomerNet(VustomerNetVO vustomerNetVO);

}
