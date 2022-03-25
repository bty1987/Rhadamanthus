package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.OccessoriesCostVO;

public interface OccessoriesCostService {

	public List<OccessoriesCostVO> queryOccessoriesCost(OccessoriesCostVO occessoriesCostVO);

	public int addOccessoriesCost(OccessoriesCostVO occessoriesCostVO) throws FLException;

	public int updateOccessoriesCost(OccessoriesCostVO occessoriesCostVO) throws FLException;

	public int deleteOccessoriesCost(OccessoriesCostVO occessoriesCostVO) throws FLException;

}
