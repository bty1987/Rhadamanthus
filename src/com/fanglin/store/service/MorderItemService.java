package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.MorderItemVO;

public interface MorderItemService{
	
	public List<MorderItemVO> queryMorderItemByUidAndStatus(MorderItemVO morderItemVO);

	public List<MorderItemVO> queryMorderItemByOid(MorderItemVO morderItemVO);
	
	public int updateMorderItemForStatus(MorderItemVO orderItemVO) throws FLException ;
}
