package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.MpriceVO;

public interface MpriceService {
	
	public List<MpriceVO> queryMprice(MpriceVO mpriceVO);
	
	public List<MpriceVO> queryMpriceByGid(MpriceVO mpriceVO);
	
	public List<MpriceVO> queryMpriceByPinyin(MpriceVO mpriceVO);
	
	public List<MpriceVO> queryMpriceForShow(MpriceVO mpriceVO);
	
	public int addMprice(MpriceVO mpriceVO) throws FLException;
	
	public int updateMpriceForStatus(MpriceVO mpriceVO);
	
}