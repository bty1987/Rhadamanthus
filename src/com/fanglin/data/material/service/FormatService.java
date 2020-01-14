package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.vo.FormatVO;

public interface FormatService {
	
	public List<FormatVO> queryFormatByGid(FormatVO formatVO);
	
	public List<FormatVO> queryFormatForEnableByGid(FormatVO formatVO);
	
	public int addFormat(FormatVO formatVO) throws FLException;
	
	public int updateFormatForStatus(FormatVO formatVO) throws FLException;
	
}
