package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructerVO;
import com.fanglin.core.interceptor.FLException;

public interface ConstructerService {

	public List<ConstructerVO> queryConstructerByOrderId(ConstructerVO constructer);

	public List<ConstructerVO> queryConstructerByCid(ConstructerVO constructer);

	public ConstructerVO queryConstructerByCrid(ConstructerVO constructer);

	public void addConstructer(ConstructerVO constructer, String createrId) throws FLException;

	public void updateConstructerForRate(List<ConstructerVO> constructerVOs) throws FLException;

	public void rateConstructer(ConstructerVO constructerVO) throws FLException;

	public void sendConstructer(ConstructerVO constructerVO) throws FLException;

	public void deleteConstructer(ConstructerVO constructer) throws FLException;

}
