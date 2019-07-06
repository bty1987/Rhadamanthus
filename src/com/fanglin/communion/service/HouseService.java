package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.HouseVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface HouseService {

	public void pageHouse(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public HouseVO queryHouseByHid(HouseVO house) throws FLException;

	public HouseVO queryHouseByNoAHnum(HouseVO houseVO, Integer company) throws FLException;

	public int addHouse(HouseVO house, Integer company) throws FLException;

	public int existHouse(HouseVO house, Integer company);

	public int updateHouse(HouseVO house) throws FLException;

}
