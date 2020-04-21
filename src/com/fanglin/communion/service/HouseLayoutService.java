package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.HouseLayoutVO;
import com.fanglin.core.interceptor.FLException;

public interface HouseLayoutService {
	
	public List<HouseLayoutVO> queryHouseLayout(HouseLayoutVO houseLayoutVO);
	
	public void addHouseLayout(HouseLayoutVO houseLayoutVO) throws FLException;
	
	public void deleteHouseLayout(HouseLayoutVO houseLayoutVO) throws FLException;
	
}
