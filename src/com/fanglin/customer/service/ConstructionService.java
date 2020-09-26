package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.ConstructionScheduleVO;
import com.fanglin.customer.vo.ConstructionVO;

public interface ConstructionService {

	public ConstructionVO queryCusConstruction(String orderId);

	public List<ConstructionScheduleVO> queryCusConstructionSchedule(String orderId) throws FLException;

}
