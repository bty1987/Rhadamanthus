package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.ColorVO;

public interface ColorService {
	
	public List<ColorVO> queryColorByGid(ColorVO colorVO);
	
	public List<ColorVO> queryColorForEnableByGid(ColorVO colorVO);
	
	public int addColor(ColorVO colorVO) throws FLException;
	
	public int updataColorForStatus(ColorVO colorVO) throws FLException;
	
}
