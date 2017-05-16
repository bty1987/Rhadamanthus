package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructerVO;
import com.fanglin.core.interceptor.FLException;

public interface ConstructerService {
	
	public List<ConstructerVO> queryConstructerByOrderId(ConstructerVO constructer);

	public List<ConstructerVO> queryConstructerByCsId(ConstructerVO constructer);

	public void addConstructer(ConstructerVO constructer, String createrId) throws FLException;

	public void updateConstructerForSalary(ConstructerVO constructer) throws FLException;

	public void updateConstructerForRate(ConstructerVO constructer) throws FLException;

	public void deleteConstructer(ConstructerVO constructer);
 
}
