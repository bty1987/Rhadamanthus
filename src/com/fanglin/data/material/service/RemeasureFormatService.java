package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.vo.RemeasureFormatVO;

public interface RemeasureFormatService {

	public List<RemeasureFormatVO> queryRemeasureFormatByBid(RemeasureFormatVO remeasureFormatVO);

	public RemeasureFormatVO queryRemeasureFormatByRfid(RemeasureFormatVO remeasureFormatVO);

	public int addRemeasureFormat(RemeasureFormatVO remeasureFormatVO, int company) throws FLException;

	public int updateRemeasureFormat(RemeasureFormatVO remeasureFormatVO) throws FLException;

	public int updateRemeasureFormatForStatus(RemeasureFormatVO remeasureFormatVO) throws FLException;

}
