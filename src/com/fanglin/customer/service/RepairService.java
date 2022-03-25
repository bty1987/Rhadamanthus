package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.RepairVO;

public interface RepairService {

	public List<RepairVO> queryRepair(RepairVO repairVO);

	public int addRepair(RepairVO repairVO, String userId);

	public int keepRepair(RepairVO repairVO, String userId) throws FLException;

	public int finishRepair(RepairVO repairVO, String userId) throws FLException;

}
