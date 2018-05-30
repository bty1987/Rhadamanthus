package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.MformatVO;

public interface MformatService {
	
	public List<MformatVO> queryMformatByGid(MformatVO mformatVO);
	
	public List<MformatVO> queryMformatByGidAndStatus(MformatVO mformatVO);
	
	public void addMformat(MformatVO mformatVO) throws FLException;
	
	public void updateMformat(MformatVO mformatVO) throws FLException;
	
	public void updateMformatForStatus(MformatVO mformatVO) throws FLException;

}
