package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.HardwareVO;
import com.fanglin.utils.Paging;

public interface HardwareService {

	public void pageHardware(Paging paging,List<Filter> filters,int company);
	
	public List<HardwareVO> queryHardwareByPid(HardwareVO hardwareVO);
	
	public int addHardware(HardwareVO hardwareVO, String userId, int company) throws FLException;
	
	public int updateHardware(HardwareVO hardwareVO) throws FLException;
		
	public int instoreHardware(HardwareVO hardwareVO) throws FLException;
	
	public int finishHardware(HardwareVO hardwareVO, String userId) throws FLException;
	
	public int deleteHardware(HardwareVO hardwareVO) throws FLException;
	
}
