package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.HardwareVO;
import com.fanglin.production.vo.ProductionVO;
import com.fanglin.utils.Paging;

public interface HardwareService {

	public void pageHardware(Paging paging,List<Filter> filters,ProductionVO productionVO);
	
	public int addHardware(HardwareVO hardwareVO) throws FLException;
	
	public int updateHardware(HardwareVO hardwareVO) throws FLException;
	
	public int updateHardwareForStatus(HardwareVO hardwareVO) throws FLException;
	
	public int deleteHardware(HardwareVO hardwareVO) throws FLException;
	
}
