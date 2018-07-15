package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.McolorVO;

public interface McolorService {
	
	public List<McolorVO> queryMcolorByGid(McolorVO mcolorVO);
	
	public List<McolorVO> queryMcolor(McolorVO mcolorVO);
	
	public void addMcolor(McolorVO mcolorVO) throws FLException;
	
	public void updateMcolorForStatus(McolorVO mcolorVO) throws FLException;

}
