package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.HouseVO;
import com.fanglin.utils.Paging;

public interface HouseService {

	public void pageHouse(Paging paging, List<Filter> filters) throws FLException;
	
	public HouseVO queryHouseByHid(HouseVO house) throws FLException;
	
	public HouseVO queryHouseByNoAHnum(HouseVO houseVO) throws FLException;
	
	public int addHouse(HouseVO house) throws FLException ;
	
	public int updateHouse(HouseVO house) throws FLException;
	
}
