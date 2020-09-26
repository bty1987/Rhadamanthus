package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.MformatVO;

public interface MformatService {

	public List<MformatVO> queryMformatByGid(MformatVO mformatVO);

	public List<MformatVO> queryMformat(MformatVO mformatVO);

	public int addMformat(MformatVO mformatVO);

	public int updateMformatForStatus(MformatVO mformatVO) throws FLException;

}
