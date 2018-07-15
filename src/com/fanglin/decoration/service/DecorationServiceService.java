package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.decoration.vo.DecorationServiceVO;

public interface DecorationServiceService {
	
	public List<DecorationServiceVO> queryDecorationServiceByOrderId(DecorationServiceVO decorationServiceVO);

	public int addDecortionService(DecorationServiceVO decorationServiceVO,Authentication authentication) throws FLException;
	
	public int completeDecorationService(DecorationServiceVO decorationServiceVO) throws FLException;
}
