package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.MformatVO;

public interface MformatService {
	
	public List<MformatVO> queryMformatByGid(MformatVO mformatVO);
	
	public List<MformatVO> queryMformat(MformatVO mformatVO);
	
	public void addMformat(MformatVO mformatVO);
	
	public void updateMformatForStatus(MformatVO mformatVO) throws FLException;

}
